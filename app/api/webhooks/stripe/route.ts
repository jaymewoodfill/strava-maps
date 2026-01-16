import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { prisma } from "@/lib/db"
import { sendPurchaseConfirmationEmail } from "@/lib/email/client"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object
        const { routeId, userId, routeTitle } = paymentIntent.metadata

        // Create purchase record
        await prisma.purchase.create({
          data: {
            userId,
            routeId,
            amount: paymentIntent.amount / 100,
            paymentProvider: "STRIPE",
            transactionId: paymentIntent.id,
            status: "COMPLETED",
          },
        })

        // Get user email
        const user = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (user?.email) {
          const downloadUrl = `${process.env.NEXTAUTH_URL}/dashboard/routes/${routeId}`
          await sendPurchaseConfirmationEmail(
            user.email,
            routeTitle,
            downloadUrl
          )
        }

        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object
        const userId = subscription.metadata.userId

        await prisma.subscription.upsert({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          update: {
            status:
              subscription.status === "active" ? "ACTIVE" : "CANCELLED",
            endDate: new Date(subscription.current_period_end * 1000),
          },
          create: {
            userId,
            planType: "MONTHLY", // or determine from price ID
            status:
              subscription.status === "active" ? "ACTIVE" : "CANCELLED",
            stripeSubscriptionId: subscription.id,
            startDate: new Date(subscription.current_period_start * 1000),
            endDate: new Date(subscription.current_period_end * 1000),
          },
        })

        // Update user subscription status
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus:
              subscription.status === "active" ? "ACTIVE" : "CANCELLED",
          },
        })

        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object

        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            status: "CANCELLED",
          },
        })

        // Find user and update status
        const sub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (sub) {
          await prisma.user.update({
            where: { id: sub.userId },
            data: { subscriptionStatus: "CANCELLED" },
          })
        }

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    )
  }
}
