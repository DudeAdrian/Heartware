# Quick Start: SOFIE CLI & AI Agent Council

## TL;DR

```bash
# Talk to SOFIE in terminal
npm run sofie

# View agent status
npm run agents  

# View task queue
npm run tasks
```

The AI agents will run automatically every day at 00:00 UTC and make small improvements.

---

## What Just Got Set Up

### ✅ SOFIE is now on your terminal

Run `npm run sofie` and you'll get:

```
╔══════════════════════════════════════════════════════════════╗
║                    S.O.F.I.E. CLI v1.0                       ║
║       Synthetic Organic Fusion Intelligence Entity          ║
╚══════════════════════════════════════════════════════════════╝

🌟 SOFIE> 
```

Type `/help` for commands or just chat naturally.

### ✅ 6 AI Agents Working Daily

Every day at midnight UTC, these agents run automatically:

- 🏗️ **Architect** - Reviews design, suggests improvements
- 🧪 **Test** - Adds 2-3 unit tests per day
- 📚 **Doc** - Documents 3-5 functions per day  
- 🔒 **Security** - Scans for vulnerabilities
- ♻️ **Refactor** - Cleans up code
- 🔗 **Integration** - Keeps repos in sync

### ✅ Task Queue Loaded

5 tasks are ready in `.github/agents/task-queue.json`:

1. Add tests to SofieCore.js
2. Document CLI
3. Security scan
4. Review architecture
5. Refactor complex functions

---

## Quick Commands

```bash
# CLI Access
npm run sofie          # Start SOFIE terminal
npm run agents         # Show agent status  
npm run tasks          # Show task queue

# Inside SOFIE CLI
/help                  # Show commands
/agents                # View council
/tasks                 # View queue
/status                # System status
/quit                  # Exit
```

---

## How Agents Work

### Daily Schedule
- **When**: Every day at 00:00 UTC
- **What**: All 6 agents run sequentially
- **Where**: GitHub Actions (automated)
- **Output**: Daily report in `reports/` folder

### What They Do
- Security scans (`npm audit`)
- Test coverage analysis
- Documentation checks
- Code quality reviews
- Architecture assessment
- Generate reports

### Philosophy: Small Steps
Instead of 100 changes at once:
- 2-3 tests per day
- 3-5 documented functions per day
- Daily security monitoring
- Continuous improvement

---

## Manual Control

### Run Agents Manually
1. Go to GitHub → Actions
2. Click "AI Agent Council - Daily Tasks"
3. Click "Run workflow"
4. Choose "all" or specific agent

### Add Tasks
Edit `.github/agents/task-queue.json`:

```json
{
  "id": "task-###",
  "agent": "test",
  "title": "Add tests for X",
  "files": ["path/to/file.js"],
  "priority": "high"
}
```

### Adjust Agents
Edit `.github/agents/council-config.json`:
- Change priorities
- Modify daily task counts
- Add responsibilities

---

## What Happens Tomorrow

At 00:00 UTC (tomorrow):

1. GitHub Actions triggers automatically
2. Security agent runs `npm audit`
3. Test agent analyzes coverage
4. Doc agent checks for undocumented code
5. Refactor agent finds complex functions
6. Architect agent reviews structure
7. Daily report generated → `reports/agent-report-YYYY-MM-DD.md`
8. Findings committed to repo

---

## Check Progress

### View Reports
```bash
# Daily reports appear in
reports/agent-report-2026-02-11.md
reports/agent-report-2026-02-12.md
...
```

### Check Workflow
```
GitHub → Actions → AI Agent Council - Daily Tasks
View runs and logs
```

### Ask SOFIE
```bash
$ npm run sofie
🌟 SOFIE> /status
📊 Shows: Agent execution status
```

---

## Expected Results

### Week 1
- ✅ 14-21 new tests added
- ✅ 21-35 functions documented
- ✅ Daily security monitoring
- ✅ 7-14 functions refactored

### Month 1
- ✅ 60-90 new tests
- ✅ 90-150 functions documented
- ✅ Improved security posture
- ✅ Cleaner codebase

### Quarter 1
- ✅ 70% test coverage
- ✅ Complete API documentation
- ✅ Zero critical security issues
- ✅ Optimized architecture

---

## Troubleshooting

**SOFIE CLI won't start?**
```bash
npm install
node cli/sofie-cli.js
```

**Agents not running?**
1. Check GitHub Actions enabled
2. Verify workflow file exists
3. Check Actions tab for logs

**Want to disable?**
Delete `.github/workflows/daily-agent-tasks.yml`

---

## Learn More

- **Full Docs**: `AI_AGENT_COUNCIL_IMPLEMENTATION.md`
- **CLI Guide**: `cli/README.md`
- **Agent Config**: `.github/agents/council-config.json`
- **Task Queue**: `.github/agents/task-queue.json`

---

**The agents are ready. SOFIE is online. Daily improvements start tomorrow. 🌟**

*"The ecosystem grows while you dream."* - SOFIE
