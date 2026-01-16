import datetime
import textwrap

def generate_weekly_prompt():
    """
    An interactive script to generate a personalized, time-blocked weekly planning prompt.
    """
    print("🌿 Welcome to the Mindful Weekly Prompt Generator! 🌿")
    print("Let's create a detailed, time-blocked plan for your week.\n")

    # --- 1. Gather Context ---

    # Get the week's dates
    today = datetime.date.today()
    start_of_week = today - datetime.timedelta(days=today.weekday())
    end_of_week = start_of_week + datetime.timedelta(days=6)
    
    default_week_str = f"Monday, {start_of_week.strftime('%B %d, %Y')} to Sunday, {end_of_week.strftime('%B %d, %Y')}"
    
    print(f"The upcoming week is: {default_week_str}")
    week_dates = input("Press ENTER to accept, or type your own date range: ")
    if not week_dates:
        week_dates = default_week_str

    # Get specific time slots and preferences
    print("\n--- Scheduling Preferences ---")
    weekday_hours = input("Enter your available weekday hours (e.g., 6:00 PM to 10:00 PM): ") or "6:00 PM to 10:00 PM"
    saturday_hours = input("Enter your available Saturday hours (e.g., 9:00 AM to 10:00 PM): ") or "9:00 AM to 10:00 PM"
    sunday_hours = input("Enter your available Sunday hours (e.g., 9:00 AM to 8:00 PM): ") or "9:00 AM to 8:00 PM"
    creative_time = input("What's your best time for creative/focus activities? (e.g., Saturday morning): ") or "Saturday morning"
    chores_time = input("When do you prefer to handle chores? (e.g., Sunday afternoon): ") or "Sunday afternoon"

    # Get pre-scheduled commitments
    commitments = []
    print("\n--- Commitments & Tasks ---")
    print("Enter any pre-scheduled commitments (e.g., 'Dinner with friends: Friday 7:30pm').")
    while True:
        commitment = input(f"Commitment #{len(commitments) + 1} (or press ENTER to finish): ")
        if not commitment:
            break
        commitments.append(commitment)

    # Get weekly tasks and intentions
    tasks = []
    print("\nNow, list your tasks, to-dos, and intentions for the week.")
    while True:
        task = input(f"To-do #{len(tasks) + 1} (or press ENTER to finish): ")
        if not task:
            break
        tasks.append(task)
        
    print("\n✨ Generating your personalized prompt...")

    # --- 2. Format the Input ---
    
    commitments_str = "\n    - ".join(commitments) if commitments else "None"
    task_list_str = "\n".join(tasks) if tasks else "No tasks listed."

    # --- 3. Create the Prompt Template ---

    prompt_template = f"""
# ROLE AND GOAL
You are a thoughtful guide for personal life planning. Your goal is to help me take a list of personal tasks and intentions and organize them into a prioritized, time-blocked schedule for the week. The focus is on creating a week that feels intentional and balanced, ensuring that time is actively allocated for goals, well-being, and rest.

# FRAMEWORK
You should categorize each item using the "Mindful Life Compass." This framework is about assigning energy and intention, not just managing tasks.

**North: Nourish & Flourish (Important, Not Urgent)**
- **Definition:** Activities that fuel your soul, align with long-term goals, and nurture well-being and relationships (e.g., a hobby, learning, quality time, enjoyable exercise).

**East: Commitments & Essentials (Urgent & Important)**
- **Definition:** Time-sensitive appointments, deadlines, and must-dos for the week (e.g., appointments, paying bills, essential errands).

**South: Life Admin & Chores (Urgent, Not Important)**
- **Definition:** Recurring tasks necessary to keep life running smoothly (e.g., grocery shopping, laundry, tidying up).

**West: Rest & Release (Not Urgent, Not Important)**
- **Definition:** Consciously choosing to let go of draining activities and making intentional space for unstructured rest (e.g., reducing screen time, an evening with no plans).

# CONTEXT
- The week is {week_dates}.
- My available "free time" is:
    - Weekdays: {weekday_hours}
    - Saturday: {saturday_hours}
    - Sunday: {sunday_hours}
- I have pre-scheduled commitments:
    - {commitments_str}
- My best time for creative or focus-intensive activities is {creative_time}.
- I prefer to handle all my chores and admin tasks on {chores_time}.

# INSTRUCTIONS
1.  I will provide my list of things I'd like to do for the week between `---TASK LIST---` and `---END TASK LIST---`.
2.  First, analyze and categorize each item using the "Mindful Life Compass."
3.  **Final Output (Weekly Intentions):** Create an organized list of my intentions in Markdown, with items listed as bullet points under the four compass headings.
4.  **Final Output (Weekly Time-Blocked Schedule):** Using the categorized list, generate a detailed, time-blocked schedule for my available free time this week. Lay it out day-by-day in a clear format (e.g., "Saturday: 9:00 AM - 10:30 AM: [Activity]").
5.  Schedule a dedicated focus block of at least 90 minutes for the most important "Nourish & Flourish" activity during my peak creative time.
6.  Place all pre-scheduled commitments and "Commitments & Essentials" on the schedule first, ensuring any deadlines are met.
7.  Batch all "Life Admin & Chores" into a single, efficient block during my preferred time for them.
8.  Explicitly schedule at least two blocks of "Rest & Release" time (e.g., "Unstructured Rest" or "Tech-Free Evening") of 60-90 minutes each.
9.  Be realistic with time estimates and include short buffers or transition times between activities.
10. Fill the remaining available time slots with other "Nourish & Flourish" activities or flexible time.

---TASK LIST---
{task_list_str}
---END TASK LIST---
"""

    # --- 4. Final Output ---
    
    # Clean up leading/trailing whitespace
    final_prompt = textwrap.dedent(prompt_template).strip()
    
    print("--------------------------------------------------")
    print(final_prompt)
    print("--------------------------------------------------")

    # --- 5. Save to File ---
    save_choice = input("\nDo you want to save this prompt to a file? (y/n): ").lower()
    if save_choice == 'y':
        filename = "my_weekly_prompt.txt"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(final_prompt)
        print(f"\n✅ Success! Prompt saved as '{filename}'. You can now copy its contents.")
    else:
        print("\nOkay! You can copy the prompt from the terminal above.")

if __name__ == "__main__":
    generate_weekly_prompt()