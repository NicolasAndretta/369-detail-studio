@echo off
REM Commit script for CSS layout fixes

cd /d "C:\Users\Usuario\369-detail-studio.worktrees\agents-fix-landing-layout-responsive-css"

REM Stage all changes
git add -A

REM Commit with message
git commit -m "fix: improve hero and navbar layout, spacing, and responsive behavior" -m "- Hero: Add clamp() for responsive padding (6-10rem top, 3-6rem bottom)" -m "- Hero: Increase body gap to 2.25rem for better vertical breathing room" -m "- Hero: Improve heading line-height (1.02 -> 1.1) and description (1.75 -> 1.8)" -m "- Hero: Metrics responsive layout (mobile stack, tablet grid, desktop flex)" -m "- Hero: Add max-width constraints to blur layers to prevent overflow" -m "- Navbar: Add consistent padding-inline (1.5rem mobile, 2rem desktop)" -m "- Navbar: Increase links gap to 2.5rem for better spacing" -m "- Maintain: Premium dark aesthetic, green accent, glassmorphism, Framer Motion" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo.
echo Commit completed. Status:
git status --short

echo.
echo Latest commit:
git log --oneline -1
