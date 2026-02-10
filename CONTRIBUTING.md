# Contributing to PIMBuddy

Thank you for your interest in contributing to PIMBuddy! This document provides guidelines and instructions for contributing.

## 🤝 Code of Conduct

By participating in this project, you agree to:
- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## 🐛 Reporting Bugs

Before submitting a bug report:
1. **Check existing issues** to avoid duplicates
2. **Test with latest version** to ensure bug still exists
3. **Gather information**:
   - Browser version and OS
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Console errors (F12 → Console)

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. Windows 11]
 - Browser: [e.g. Chrome 120]
 - Version: [e.g. 1.0.0]

**Additional context**
Any other context about the problem.
```

## 💡 Suggesting Features

We welcome feature suggestions! To suggest a feature:

1. **Check existing feature requests** in GitHub Issues
2. **Create a new issue** with the "Feature Request" label
3. **Describe the feature**:
   - What problem does it solve?
   - How would it work?
   - Any implementation ideas?
4. **Discuss** with maintainers and community

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

## 🔧 Development Setup

### Prerequisites

- Node.js 18 or higher
- Git
- Modern code editor (VS Code recommended)
- Azure tenant with Entra ID P2 (for testing)

### Getting Started

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/PIMBuddy.git
   cd PIMBuddy
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/originalowner/PIMBuddy.git
   ```

4. **Install dependencies**:
   ```bash
   cd pimbuddy-web
   npm install
   ```

5. **Configure authentication** (see [README.md](README.md))

6. **Start development server**:
   ```bash
   npm run dev
   ```

7. **Create a branch** for your work:
   ```bash
   git checkout -b feature/amazing-feature
   ```

## 📝 Making Changes

### Code Style Guidelines

**JavaScript**:
- Use ES6+ syntax (const/let, arrow functions, async/await)
- Use meaningful variable names (`getUserById` not `gub`)
- Add JSDoc comments for functions
- Keep functions small and focused
- Handle errors gracefully

**Example**:
```javascript
/**
 * Retrieve a user by their ID
 * @param {string} userId - The user's unique identifier
 * @returns {Promise<Object>} User object
 * @throws {Error} If user not found
 */
async function getUserById(userId) {
    try {
        const response = await graphService.get(`/users/${userId}`);
        return response;
    } catch (error) {
        console.error(`Failed to fetch user ${userId}:`, error);
        throw new Error(`User not found: ${userId}`);
    }
}
```

**CSS**:
- Use CSS variables for colors and spacing
- Follow existing naming conventions
- Mobile-first responsive design
- Ensure dark mode compatibility

**HTML**:
- Semantic HTML5 elements
- ARIA attributes for accessibility
- Descriptive IDs and classes

### Accessibility Requirements

All contributions must meet **WCAG 2.1 AA** standards:
- ✅ Keyboard navigation support (Tab, Enter, Escape, Arrow keys)
- ✅ ARIA labels and roles
- ✅ Sufficient color contrast (4.5:1 for text)
- ✅ Focus indicators
- ✅ Screen reader announcements
- ✅ Skip links for navigation

**Test accessibility**:
1. Navigate using keyboard only (no mouse)
2. Test with screen reader (NVDA, JAWS, VoiceOver)
3. Use browser DevTools Accessibility Inspector
4. Run Lighthouse accessibility audit (target 90+)

### Testing Checklist

Before submitting:
- [ ] Code runs without errors (`npm run dev`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors or warnings
- [ ] Tested in Chrome, Firefox, Edge
- [ ] Tested on mobile viewport
- [ ] Dark mode works correctly
- [ ] Keyboard navigation works
- [ ] No accessibility regressions
- [ ] Tested with real Microsoft Graph API

## 🔀 Pull Request Process

### Before Submitting

1. **Pull latest changes** from upstream:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test your changes** thoroughly

3. **Commit with clear messages**:
   ```bash
   git commit -m "Add feature: user role filtering"
   ```

   Good commit messages:
   - `feat: Add bulk activation for eligible roles`
   - `fix: Resolve approval workflow redirect issue`
   - `docs: Update deployment guide for Azure`
   - `style: Improve dark mode contrast ratios`
   - `refactor: Simplify graph service error handling`

4. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```

### Creating the Pull Request

1. Go to your fork on GitHub
2. Click **Pull Request** → **New Pull Request**
3. Set base to `main` branch of upstream repository
4. Fill out the PR template:

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where needed
- [ ] I have updated documentation
- [ ] My changes generate no new warnings
- [ ] I have tested accessibility
- [ ] I have tested in multiple browsers
```

5. Click **Create Pull Request**

### Review Process

1. **Automated checks** run (build, lint)
2. **Maintainer review** (1-3 business days)
3. **Address feedback** if requested
4. **Approval and merge** once approved

## 📂 Project Structure

Understanding the codebase:

```
pimbuddy-web/
├── index.html                 # Entry point
├── src/
│   ├── app.js                 # Bootstrap application
│   ├── config/
│   │   └── authConfig.js      # MSAL configuration
│   ├── core/
│   │   ├── PageRouter.js      # SPA routing logic
│   │   ├── AccessibilityManager.js  # A11y features
│   │   └── CacheManager.js    # Local caching
│   ├── pages/
│   │   └── [Page]Page.js      # Individual page modules
│   ├── services/
│   │   ├── authService.js     # MSAL wrapper
│   │   └── graphService.js    # Graph API client
│   ├── utils/
│   │   └── *.js               # Helper functions
│   └── styles/
│       └── main.css           # Global styles
```

### Adding a New Page

1. **Create page module**: `src/pages/NewPage.js`
2. **Export render function**:
   ```javascript
   export async function renderNewPage() {
       const container = document.createElement('div');
       container.className = 'page-content';
       container.innerHTML = `<h2>New Page</h2>`;
       return container;
   }
   ```
3. **Register in router**: `src/core/PageRouter.js`
4. **Add navigation item**: `index.html`

### Adding a New Service Function

1. **Add to appropriate service**: `src/services/graphService.js`
2. **Follow async/await pattern**:
   ```javascript
   async getResource(id) {
       try {
           return await this.get(`/resource/${id}`);
       } catch (error) {
           throw this.handleError(error, 'Failed to get resource');
       }
   }
   ```
3. **Handle errors gracefully**
4. **Add JSDoc comments**

## 🧪 Testing Guidelines

### Manual Testing

Test all affected functionality:
- Happy path (normal usage)
- Edge cases (empty data, max limits)
- Error scenarios (network failures, invalid input)
- Cross-browser compatibility
- Mobile responsiveness

### Test Cases

When adding features, document test cases:

```markdown
### Test Case: Activate Eligible Role

**Setup**: User has eligible role assignment

**Steps**:
1. Navigate to My Activations
2. Click Activate on eligible role
3. Enter duration: 8 hours
4. Enter justification: "Production incident"
5. Click Activate

**Expected Result**:
- Loading indicator appears
- Success toast message
- Role status changes to "Active"
- Deactivate button appears

**Tested**: ✅ Chrome, ✅ Firefox, ✅ Edge
```

## 🚀 Release Process

(For maintainers)

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release tag: `git tag v1.1.0`
4. Push tag: `git push --tags`
5. Create GitHub Release with notes
6. Deployment to GitHub Pages happens automatically

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🎓 Learning Resources

**Microsoft Graph API**:
- [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)
- [Graph API Docs](https://learn.microsoft.com/graph/)
- [PIM API Reference](https://learn.microsoft.com/graph/api/resources/privilegedidentitymanagementv3-overview)

**MSAL.js**:
- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Authentication flows](https://learn.microsoft.com/azure/active-directory/develop/msal-authentication-flows)

**Web Accessibility**:
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)

## ❓ Questions?

- **GitHub Discussions**: Ask questions and discuss ideas
- **GitHub Issues**: Report bugs and request features
- **Email**: maintainer@example.com (if applicable)

---

**Thank you for contributing to PIMBuddy!** 🎉
