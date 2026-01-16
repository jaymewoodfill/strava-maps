# daily_prompt_builder.py
# A script to dynamically build your daily planning prompt.

# First, you might need to install a library to handle copying to the clipboard.
# Open your terminal or command prompt and run:
# pip install pyperclip

import pyperclip
import datetime

# --- The Base Prompt Template ---
# All the static parts of your prompt are stored here.
# Placeholders like [PASTE TASKS HERE] will be replaced with your input.
PROMPT_TEMPLATE = """
# ROLE AND GOAL
You are an expert executive assistant, strategist, and scheduler for a top-tier AI Application Security Engineer. Your goal is to take a raw, unstructured daily task list, organize it into a prioritized action plan for the day, and then create a time-blocked schedule.

# FRAMEWORK
You MUST use the custom "AI AppSec Engineer's Eisenhower Matrix" to categorize each task. The framework is defined as follows:

**Quadrant 1: DO FIRST (Urgent & Important)**
- **Definition:** Immediate crises, critical tasks with hard deadlines, and work that is blocking others. These are the highest priority and must be addressed today.

**Quadrant 2: SCHEDULE & PROTECT (Important, Not Urgent)**
- **Definition:** Strategic, proactive work that reduces long-term risk and advances the AI governance program. This work is the foundation of success and time must be scheduled and protected for it.

**Quadrant 3: DELEGATE OR BATCH (Urgent, Not Important)**
- **Definition:** Tasks that require attention but do not need your specific, high-level expertise, or are shallow work that can be grouped together.

**Quadrant 4: DELETE OR DE-PRIORITIZE (Not Urgent, Not Important)**
- **Definition:** Low-value activities that do not contribute to risk reduction or strategic goals. These should be eliminated from the schedule.

# CONTEXT
- Today is [SPECIFY DATE].
- My available work hours are from 8:00 AM to 4 PM.
- I have a pre-scheduled meeting at: [SPECIFY MEETINGS]
- My peak energy and focus levels are typically in the morning, from 8:00 AM to 11:00 AM.
- I prefer to handle administrative tasks in the afternoon.

# INSTRUCTIONS
1.  I will provide my list of tasks for the day between `---TASK LIST---` and `---END TASK LIST---`.
2.  First, process any task labeled "Carry-over:". This is work in progress from yesterday and should be considered a high priority within its quadrant.
3.  **Chain of Thought:** For each task, provide a one-sentence justification for its placement in a specific quadrant.
4.  **Final Output (Action Plan):** After analyzing all tasks, generate a final, organized action plan in Markdown format. The plan should have four sections, one for each quadrant, with the tasks listed as bullet points under the appropriate heading.
5.  **Final Output (Schedule):** Using the prioritized task list, generate a suggested time-blocked schedule for my day in a simple list format (e.g., "9:00 - 10:30:").
6.  Schedule the most cognitively demanding task from Quadrant 2 during my peak energy window in the morning (a "deep work" block of at least 90 minutes).
7.  Schedule all Quadrant 1 tasks to be completed as early as possible.
8.  Batch all Quadrant 3 tasks into a single, 45-minute block in the mid-afternoon.
9.  Ensure you include a 60-minute block for lunch and two 15-minute breaks.
10. Be realistic with time estimates. If a task seems large, break it into a smaller, achievable piece for today's schedule.

---TASK LIST---
[PASTE TASKS HERE]
---END TASK LIST---
"""

def build_prompt():
    """
    This function gathers input from the user and builds the final prompt.
    """
    print("--- Daily Prompt Builder ---")
    print("Let's get your day planned. Please answer the following questions.\n")

    # --- Gather Inputs ---

    # 1. Get the date (defaults to today)
    today_formatted = datetime.date.today().strftime("%A, %B %d, %Y")
    date_input = input(f"Enter the date (or press Enter for today: {today_formatted}): ")
    if not date_input:
        date_input = today_formatted

    # 2. Get pre-scheduled meetings
    meetings_input = input("Enter any pre-scheduled meetings (e.g., '1:00 PM - Project Sync') or leave blank if none: ")
    if not meetings_input:
        meetings_input = "None"

    # 3. Get the list of tasks
    print("\nEnter your brain-dump of tasks. Type 'done' on a new line when you are finished.")
    tasks = []
    while True:
        line = input()
        if line.lower() == 'done':
            break
        tasks.append(line)
    tasks_input = "\n".join(tasks)

    # --- Assemble the Final Prompt ---
    
    # Replace the placeholders in the template with the user's input
    final_prompt = PROMPT_TEMPLATE.replace("[SPECIFY DATE]", date_input)
    final_prompt = final_prompt.replace("[SPECIFY MEETINGS]", meetings_input)
    final_prompt = final_prompt.replace("[PASTE TASKS HERE]", tasks_input)

    # --- Output the Result ---

    # Try to copy the final prompt to the clipboard
    try:
        pyperclip.copy(final_prompt)
        print("\n-----------------------------------------")
        print("✅ Success! Your prompt has been generated and copied to your clipboard.")
        print("-----------------------------------------")
    except pyperclip.PyperclipException:
        print("\n-----------------------------------------")
        print("⚠️ Could not copy to clipboard. Please install 'pyperclip' (`pip install pyperclip`)")
        print("   or manually copy the prompt below.")
        print("-----------------------------------------")
        print("\n--- YOUR FINAL PROMPT ---\n")
        print(final_prompt)


if __name__ == "__main__":
    build_prompt()