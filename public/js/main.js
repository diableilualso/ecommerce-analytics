// 主应用程序逻辑
class App {
    constructor() {
        this.init();
    }

    init() {
        // 初始化页面交互
        this.bindEvents();
        this.checkDemoData();
    }

    bindEvents() {
        // 演示按钮
        document.getElementById('demoBtn')?.addEventListener('click', () => this.showDemo());
        
        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // 导航链接激活状态
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');
        
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 100)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    showDemo() {
        const demoHtml = `
            <div class="modal active" id="demoModal">
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header">
                        <h3 class="modal-title">功能演示</h3>
                        <button class="close-btn" onclick="app.closeDemo()">&times;</button>
                    </div>
                    <div style="padding: 1rem 0;">
                        <h4 style="margin-bottom: 1rem; color: var(--dark-color);">主要功能展示：</h4>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
                            <div style="background: var(--light-color); padding: 1rem; border-radius: var(--border-radius);">
                                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                    <i class="fas fa-file-excel" style="color: var(--success-color);"></i>
                                    <strong>Excel导入</strong>
                                </div>
                                <p style="font-size: 0.9rem; color: var(--gray-color);">
                                    下载标准模板，填写数据后上传
                                </p>
                            </div>
                            
                            <div style="background: var(--light-color); padding: 1rem; border-radius: var(--border-radius);">
                                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                    <i class="fas fa-chart-bar" style="color: var(--primary-color);"></i>
                                    <strong>数据分析</strong>
                                </div>
                                <p style="font-size: 0.9rem; color: var(--gray-color);">
                                    自动计算ROI、转化率等关键指标
                                </p>
                            </div>
                        </div>

                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                    border-radius: var(--border-radius); padding: 2rem; text-align: center; color: white;">
                            <i class="fas fa-chart-line" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                            <h4 style="margin-bottom: 0.5rem;">模拟数据分析结果</h4>
                            <div style="display: flex; justify-content: space-around; margin-top: 2rem;">
                                <div>
                                    <div style="font-size: 2rem; font-weight: bold;">245%</div>
                                    <div style="font-size: 0.9rem; opacity: 0.9;">ROI</div>
                                </div>
                                <div>
                                    <div style="font-size: 2rem; font-weight: bold;">3.8%</div>
                                    <div style="font-size: 0.9rem; opacity: 0.9;">转化率</div>
                                </div>
                                <div>
                                    <div style="font-size: 2rem; font-weight: bold;">¥156</div>
                                    <div style="font-size: 0.9rem; opacity: 0.9;">客单价</div>
                                </div>
                            </div>
                        </div>

                        <div style="margin-top: 2rem; text-align: center;">
                            <button onclick="app.startTrial()" class="btn btn-primary btn-large">
                                <i class="fas fa-rocket"></i> 立即免费试用
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modalContainer').innerHTML = demoHtml;
    }

    closeDemo() {
        document.getElementById('modalContainer').innerHTML = '';
    }

    startTrial() {
        this.closeDemo();
        window.authManager.showRegisterModal();
    }

    checkDemoData() {
        // 检查是否需要创建演示数据
        if (!localStorage.getItem('demo-data-created')) {
            this.createDemoData();
        }
    }

    createDemoData() {
        // 创建演示用户数据
        const demoUsers = [
            {
                name: '演示用户',
                email: 'demo@example.com',
                password: 'hashed_password',
                createdAt: new Date().toISOString()
            }
        ];

        localStorage.setItem('ecommerce-analytics-users', JSON.stringify(demoUsers));
        localStorage.setItem('demo-data-created', 'true');
    }
}

// 工具函数
const utils = {
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CNY'
        }).format(amount);
    },

    formatDate: (date) => {
        return new Date(date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
};

// 创建全局实例
window.app = new App();
window.utils = utils;

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('电商数据分析平台已加载');
    
    // 添加加载动画
    const loadingEl = document.createElement('div');
    loadingEl.id = 'pageLoading';
    loadingEl.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.3s ease;
    `;
    loadingEl.innerHTML = `
        <div style="text-align: center;">
            <div class="loading" style="width: 40px; height: 40px; border-width: 4px;"></div>
            <p style="margin-top: 1rem; color: var(--primary-color);">加载中...</p>
        </div>
    `;
    
    document.body.appendChild(loadingEl);
    
    // 2秒后隐藏加载动画
    setTimeout(() => {
        loadingEl.style.opacity = '0';
        setTimeout(() => {
            loadingEl.remove();
        }, 300);
    }, 2000);
});