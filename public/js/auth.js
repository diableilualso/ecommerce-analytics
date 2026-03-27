// 认证模块 - 处理用户注册和登录
class AuthManager {
    constructor() {
        // Supabase配置（将在部署时更新）
        this.supabaseUrl = 'https://your-project.supabase.co';
        this.supabaseKey = 'your-anon-key';
        this.currentUser = null;
        this.init();
    }

    init() {
        // 检查本地存储中是否有用户会话
        const savedUser = localStorage.getItem('ecommerce-analytics-user');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.updateUIForLoggedInUser();
            } catch (e) {
                console.error('解析用户数据失败:', e);
                localStorage.removeItem('ecommerce-analytics-user');
            }
        }

        // 绑定按钮事件
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('loginBtn')?.addEventListener('click', () => this.showLoginModal());
        document.getElementById('registerBtn')?.addEventListener('click', () => this.showRegisterModal());
        document.getElementById('tryFreeBtn')?.addEventListener('click', () => this.showRegisterModal());
    }

    showLoginModal() {
        const modalHtml = `
            <div class="modal active" id="loginModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">登录</h3>
                        <button class="close-btn" onclick="authManager.closeModal()">&times;</button>
                    </div>
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="loginEmail">邮箱</label>
                            <input type="email" id="loginEmail" required placeholder="请输入邮箱">
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">密码</label>
                            <input type="password" id="loginPassword" required placeholder="请输入密码">
                        </div>
                        <div id="loginMessage" class="message" style="display: none;"></div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">
                            <span id="loginBtnText">登录</span>
                            <span id="loginLoading" class="loading" style="display: none;"></span>
                        </button>
                    </form>
                    <p style="text-align: center; margin-top: 1rem; color: var(--gray-color);">
                        还没有账户？ <a href="#" onclick="authManager.showRegisterModal()" style="color: var(--primary-color);">立即注册</a>
                    </p>
                </div>
            </div>
        `;

        document.getElementById('modalContainer').innerHTML = modalHtml;
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
    }

    showRegisterModal() {
        const modalHtml = `
            <div class="modal active" id="registerModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">注册</h3>
                        <button class="close-btn" onclick="authManager.closeModal()">&times;</button>
                    </div>
                    <form id="registerForm">
                        <div class="form-group">
                            <label for="registerName">姓名</label>
                            <input type="text" id="registerName" required placeholder="请输入姓名">
                        </div>
                        <div class="form-group">
                            <label for="registerEmail">邮箱</label>
                            <input type="email" id="registerEmail" required placeholder="请输入邮箱">
                        </div>
                        <div class="form-group">
                            <label for="registerPassword">密码</label>
                            <input type="password" id="registerPassword" required placeholder="请输入密码（至少6位）">
                        </div>
                        <div class="form-group">
                            <label for="registerConfirmPassword">确认密码</label>
                            <input type="password" id="registerConfirmPassword" required placeholder="请再次输入密码">
                        </div>
                        <div id="registerMessage" class="message" style="display: none;"></div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">
                            <span id="registerBtnText">注册</span>
                            <span id="registerLoading" class="loading" style="display: none;"></span>
                        </button>
                    </form>
                    <p style="text-align: center; margin-top: 1rem; color: var(--gray-color);">
                        已有账户？ <a href="#" onclick="authManager.showLoginModal()" style="color: var(--primary-color);">立即登录</a>
                    </p>
                </div>
            </div>
        `;

        document.getElementById('modalContainer').innerHTML = modalHtml;
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
    }

    closeModal() {
        document.getElementById('modalContainer').innerHTML = '';
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const messageEl = document.getElementById('loginMessage');
        const btnText = document.getElementById('loginBtnText');
        const loading = document.getElementById('loginLoading');

        // 显示加载状态
        btnText.style.display = 'none';
        loading.style.display = 'inline-block';

        // 清除之前的消息
        messageEl.style.display = 'none';
        messageEl.textContent = '';

        try {
            // 模拟API调用（实际开发中会调用Supabase）
            await this.mockLoginAPI(email, password);
            
            // 登录成功
            this.currentUser = {
                id: 'user_' + Date.now(),
                email: email,
                name: email.split('@')[0],
                createdAt: new Date().toISOString()
            };

            // 保存到本地存储
            localStorage.setItem('ecommerce-analytics-user', JSON.stringify(this.currentUser));
            
            // 更新UI
            this.updateUIForLoggedInUser();
            
            // 显示成功消息
            this.showMessage(messageEl, '登录成功！', 'success');
            
            // 2秒后关闭模态框
            setTimeout(() => {
                this.closeModal();
                // 重定向到仪表板（后续开发）
                // window.location.href = '/dashboard.html';
            }, 2000);

        } catch (error) {
            this.showMessage(messageEl, error.message, 'error');
        } finally {
            // 恢复按钮状态
            btnText.style.display = 'inline';
            loading.style.display = 'none';
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const messageEl = document.getElementById('registerMessage');
        const btnText = document.getElementById('registerBtnText');
        const loading = document.getElementById('registerLoading');

        // 验证密码
        if (password !== confirmPassword) {
            this.showMessage(messageEl, '两次输入的密码不一致', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage(messageEl, '密码长度至少6位', 'error');
            return;
        }

        // 显示加载状态
        btnText.style.display = 'none';
        loading.style.display = 'inline-block';

        // 清除之前的消息
        messageEl.style.display = 'none';
        messageEl.textContent = '';

        try {
            // 模拟API调用（实际开发中会调用Supabase）
            await this.mockRegisterAPI(name, email, password);
            
            // 注册成功，自动登录
            this.currentUser = {
                id: 'user_' + Date.now(),
                email: email,
                name: name,
                createdAt: new Date().toISOString()
            };

            // 保存到本地存储
            localStorage.setItem('ecommerce-analytics-user', JSON.stringify(this.currentUser));
            
            // 更新UI
            this.updateUIForLoggedInUser();
            
            // 显示成功消息
            this.showMessage(messageEl, '注册成功！已自动登录', 'success');
            
            // 2秒后关闭模态框
            setTimeout(() => {
                this.closeModal();
                // 重定向到仪表板（后续开发）
                // window.location.href = '/dashboard.html';
            }, 2000);

        } catch (error) {
            this.showMessage(messageEl, error.message, 'error');
        } finally {
            // 恢复按钮状态
            btnText.style.display = 'inline';
            loading.style.display = 'none';
        }
    }

    // 模拟API调用（开发阶段）
    mockLoginAPI(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 模拟验证
                if (!email || !password) {
                    reject(new Error('邮箱和密码不能为空'));
                } else if (password.length < 6) {
                    reject(new Error('密码错误'));
                } else {
                    resolve({ success: true });
                }
            }, 1000);
        });
    }

    mockRegisterAPI(name, email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 模拟验证
                if (!name || !email || !password) {
                    reject(new Error('请填写所有必填项'));
                } else if (password.length < 6) {
                    reject(new Error('密码长度至少6位'));
                } else {
                    // 检查邮箱是否已注册（模拟）
                    const users = JSON.parse(localStorage.getItem('ecommerce-analytics-users') || '[]');
                    const existingUser = users.find(u => u.email === email);
                    
                    if (existingUser) {
                        reject(new Error('该邮箱已注册'));
                    } else {
                        // 保存用户（模拟）
                        users.push({ name, email, password: 'hashed_password', createdAt: new Date().toISOString() });
                        localStorage.setItem('ecommerce-analytics-users', JSON.stringify(users));
                        resolve({ success: true });
                    }
                }
            }, 1000);
        });
    }

    showMessage(element, text, type) {
        element.textContent = text;
        element.className = `message ${type}`;
        element.style.display = 'block';
    }

    updateUIForLoggedInUser() {
        if (!this.currentUser) return;

        const authButtons = document.querySelector('.auth-buttons');
        if (authButtons) {
            authButtons.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="color: var(--primary-color); font-weight: 500;">
                        <i class="fas fa-user"></i> ${this.currentUser.name}
                    </span>
                    <button id="logoutBtn" class="btn btn-outline">退出</button>
                </div>
            `;
            
            document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        }

        // 更新导航链接
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const dashboardLink = document.createElement('a');
            dashboardLink.href = '#';
            dashboardLink.className = 'nav-link';
            dashboardLink.innerHTML = '<i class="fas fa-tachometer-alt"></i> 仪表板';
            dashboardLink.addEventListener('click', (e) => {
                e.preventDefault();
                alert('仪表板功能开发中...');
            });
            
            navLinks.insertBefore(dashboardLink, navLinks.firstChild);
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('ecommerce-analytics-user');
        
        // 恢复原始UI
        const authButtons = document.querySelector('.auth-buttons');
        if (authButtons) {
            authButtons.innerHTML = `
                <button id="loginBtn" class="btn btn-outline">登录</button>
                <button id="registerBtn" class="btn btn-primary">注册</button>
            `;
            
            // 重新绑定事件
            document.getElementById('loginBtn').addEventListener('click', () => this.showLoginModal());
            document.getElementById('registerBtn').addEventListener('click', () => this.showRegisterModal());
        }

        // 移除仪表板链接
        const dashboardLink = document.querySelector('.nav-link i.fa-tachometer-alt')?.closest('.nav-link');
        if (dashboardLink) {
            dashboardLink.remove();
        }

        alert('已退出登录');
    }
}

// 创建全局实例
window.authManager = new AuthManager();