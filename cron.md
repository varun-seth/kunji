Cron is a time based scheduler in unix/linux.

Cron string is a standard way of representing the schedule. It has 5 items separated by spaces, representing minute, hour, day, month and week's day

Examples:
  
- `30 19 * * 1,3,5` runs at 7:30 PM every Monday, Wednesday and Friday

- `*/10 * * * *` runs at 10-minute intervals

- `0 9-17 * * 1-5` runs every hour during business hours (9 AM to 5 PM) on weekdays.

- `0 1 * * 1#1` runs at 1:00 AM on the first Monday of each month. The `#1`` means the first occurrence, this may not be supported in all cron implementations.



