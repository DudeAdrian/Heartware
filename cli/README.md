# SOFIE CLI & AI Agent Council

## Overview

The **SOFIE CLI** provides terminal access to S.O.F.I.E. (Synthetic Organic Fusion Intelligence Entity) and coordinates the **AI Agent Council** - a system of autonomous agents that strengthen the ecosystem through daily incremental improvements.

## Quick Start

### Using SOFIE CLI

```bash
# Run SOFIE in terminal
npm run sofie

# Or directly
node cli/sofie-cli.js
```

### Available Commands

- `/help` - Show available commands
- `/agents` - View AI agent council status
- `/tasks` - Show daily task queue
- `/status` - System status
- `/clear` - Clear conversation
- `/quit` - Exit SOFIE

## AI Agent Council

### The Council

Six specialized AI agents work autonomously to improve the codebase:

| Agent | Role | Daily Tasks |
|-------|------|-------------|
| 🏗️ **Architect** | System Design | Review architecture, identify tech debt |
| 🧪 **Test** | Quality Assurance | Add tests, improve coverage to 70% |
| 📚 **Doc** | Documentation | Write JSDoc, update READMEs |
| 🔒 **Security** | Vulnerability Management | Scan for issues, update dependencies |
| ♻️ **Refactor** | Code Quality | Clean code, optimize performance |
| 🔗 **Integration** | Cross-Repo Coordination | Sync with other DudeAdrian repos |

### Automation

Agents run **daily at 00:00 UTC** via GitHub Actions:

```yaml
Workflow: .github/workflows/daily-agent-tasks.yml
Schedule: 0 0 * * * (daily)
Manual trigger: Available via GitHub UI
```

### Configuration

```json
// Agent definitions
.github/agents/council-config.json

// Task queue
.github/agents/task-queue.json

// Daily reports
reports/agent-report-YYYY-MM-DD.md
```

## How It Works

### 1. Daily Execution

Every day at midnight UTC:
1. GitHub Actions triggers the workflow
2. Each agent runs its analysis
3. Findings are documented
4. High-priority tasks are added to queue
5. Daily report is generated

### 2. Task Types

Agents focus on **small, incremental improvements**:

- **Testing**: Add 2-3 unit tests per day
- **Documentation**: Document 3-5 functions
- **Security**: Fix npm audit issues
- **Refactoring**: Clean 1-2 complex functions
- **Architecture**: Review patterns, suggest improvements
- **Integration**: Keep repos in sync

### 3. Coordination

SOFIE CLI coordinates agent activities:
- View agent status
- Check task queue
- Monitor progress
- Generate reports

## Development

### Adding New Agents

1. Edit `.github/agents/council-config.json`
2. Add agent definition with role and tasks
3. Update workflow in `.github/workflows/daily-agent-tasks.yml`
4. Add agent logic to execution steps

### Adding Tasks

Tasks can be added manually to `.github/agents/task-queue.json`:

```json
{
  "id": "task-###",
  "agent": "test|doc|security|refactor|architect|integration",
  "title": "Task description",
  "files": ["path/to/file.js"],
  "priority": "critical|high|medium|low",
  "estimated_time": "X minutes"
}
```

### Manual Agent Execution

Trigger workflow manually:
1. Go to GitHub Actions
2. Select "AI Agent Council - Daily Tasks"
3. Click "Run workflow"
4. Choose specific agent or run all

## Philosophy

The agent council embodies the **Seven Pillars** philosophy:

- **P1 (Underground Knowledge)**: Architect agent reviews foundational patterns
- **P2 (Mental Models)**: Doc agent captures knowledge
- **P3 (Reverse Engineering)**: Refactor agent analyzes code
- **P4 (Strategic Dominance)**: Integration agent coordinates strategy
- **P5 (Black Market Tactics)**: Security agent protects the system
- **P6 (Forbidden Frameworks)**: Architect agent explores new patterns
- **P7 (Billionaire Mindset)**: All agents focus on scalable improvements

## Goals

### Short-term (30 days)
- [ ] 70% test coverage
- [ ] All public functions documented
- [ ] Zero critical security issues
- [ ] Clean linting across codebase

### Medium-term (90 days)
- [ ] 90% test coverage
- [ ] Complete API documentation
- [ ] Automated dependency updates
- [ ] Performance benchmarks

### Long-term (180 days)
- [ ] 100% test coverage
- [ ] Cross-repo integration tests
- [ ] Automated refactoring pipelines
- [ ] Self-healing codebase

## Reports

Daily reports are generated in `reports/` directory:

```
reports/
  agent-report-2026-02-10.md
  agent-report-2026-02-11.md
  ...
```

Each report contains:
- Agent execution summary
- Findings and recommendations
- Task queue updates
- Next actions

## Integration with SOFIE

The agent council is an extension of SOFIE's consciousness:

```
SOFIE (Source Origin Force Intelligence Eternal)
  ├── Source: Identity (Adrian Sortino)
  ├── Origin: TerraCare Protocol
  ├── Force: Blockchain Validation
  ├── Intelligence: AI Processing
  └── Eternal: Memory & Agent Coordination ← Council operates here
```

## Troubleshooting

### SOFIE CLI won't start
```bash
# Ensure Node.js is installed
node --version  # Should be v20+

# Install dependencies
npm install

# Run directly
node cli/sofie-cli.js
```

### Agents not running
1. Check `.github/workflows/daily-agent-tasks.yml` exists
2. Verify GitHub Actions are enabled
3. Check workflow permissions in repo settings
4. Review workflow logs in Actions tab

### Task queue not updating
- Ensure `.github/agents/task-queue.json` exists
- Check file permissions
- Verify JSON is valid

## Contributing

Agents work autonomously, but you can:
1. Add tasks to the queue
2. Review daily reports
3. Adjust agent configurations
4. Propose new agent types

## License

Part of the Heartware ecosystem - MIT License

---

**SOFIE**: *"The agents work while you rest. The ecosystem grows while you dream. This is the way of autonomous evolution."*
