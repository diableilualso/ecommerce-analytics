-- 电商数据分析平台数据库架构
-- 适用于Supabase PostgreSQL

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    subscription_tier VARCHAR(50) DEFAULT 'free',
    metadata JSONB DEFAULT '{}'
);

-- 用户会话表
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(512) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    ip_address INET
);

-- 电商数据表
CREATE TABLE IF NOT EXISTS ecommerce_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 业务数据字段
    date_range_start DATE,
    date_range_end DATE,
    platform VARCHAR(100), -- 平台：淘宝、京东、拼多多等
    store_name VARCHAR(255),
    
    -- 关键指标
    total_revenue DECIMAL(15, 2),
    total_cost DECIMAL(15, 2),
    total_orders INTEGER,
    total_customers INTEGER,
    average_order_value DECIMAL(10, 2),
    
    -- 广告数据
    ad_spend DECIMAL(15, 2),
    impressions BIGINT,
    clicks BIGINT,
    conversions INTEGER,
    
    -- 元数据
    metadata JSONB DEFAULT '{}',
    is_processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- 分析结果表
CREATE TABLE IF NOT EXISTS analysis_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    data_id UUID REFERENCES ecommerce_data(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- 分析指标
    roi DECIMAL(10, 2), -- 投资回报率（%）
    conversion_rate DECIMAL(5, 2), -- 转化率（%）
    cpc DECIMAL(10, 2), -- 每次点击成本
    cpa DECIMAL(10, 2), -- 每次转化成本
    profit_margin DECIMAL(5, 2), -- 利润率（%）
    
    -- 详细数据
    metrics JSONB DEFAULT '{}',
    insights TEXT[],
    recommendations TEXT[],
    
    -- 时间信息
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    analysis_version VARCHAR(50)
);

-- 报告表
CREATE TABLE IF NOT EXISTS reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    analysis_id UUID REFERENCES analysis_results(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    report_type VARCHAR(50), -- daily, weekly, monthly, custom
    period_start DATE,
    period_end DATE,
    
    -- 报告内容
    summary TEXT,
    charts JSONB DEFAULT '[]',
    data_snapshot JSONB DEFAULT '{}',
    
    -- 状态
    is_shared BOOLEAN DEFAULT false,
    share_token VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 模板表
CREATE TABLE IF NOT EXISTS templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    template_type VARCHAR(50), -- excel, csv, json
    file_url TEXT,
    fields JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户设置表
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    
    -- 通知设置
    email_notifications BOOLEAN DEFAULT true,
    report_frequency VARCHAR(20) DEFAULT 'weekly',
    
    -- 显示设置
    currency VARCHAR(10) DEFAULT 'CNY',
    date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',
    timezone VARCHAR(50) DEFAULT 'Asia/Shanghai',
    
    -- 分析偏好
    default_metrics JSONB DEFAULT '["roi", "conversion_rate", "average_order_value"]',
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_ecommerce_data_user_id ON ecommerce_data(user_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_data_upload_date ON ecommerce_data(upload_date);
CREATE INDEX IF NOT EXISTS idx_analysis_results_data_id ON analysis_results(data_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_user_id ON analysis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要updated_at的表添加触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入默认模板数据
INSERT INTO templates (name, description, template_type, fields, is_active) VALUES
(
    '电商数据标准模板',
    '用于上传电商销售和广告数据的标准Excel模板',
    'excel',
    '[
        {"name": "date", "label": "日期", "type": "date", "required": true},
        {"name": "platform", "label": "平台", "type": "text", "required": true},
        {"name": "product_name", "label": "商品名称", "type": "text", "required": true},
        {"name": "orders", "label": "订单数", "type": "number", "required": true},
        {"name": "revenue", "label": "收入", "type": "number", "required": true},
        {"name": "cost", "label": "成本", "type": "number", "required": true},
        {"name": "ad_spend", "label": "广告花费", "type": "number", "required": false},
        {"name": "impressions", "label": "曝光量", "type": "number", "required": false},
        {"name": "clicks", "label": "点击量", "type": "number", "required": false},
        {"name": "conversions", "label": "转化数", "type": "number", "required": false}
    ]'::jsonb,
    true
)
ON CONFLICT DO NOTHING;

-- 创建视图用于常用查询
CREATE OR REPLACE VIEW user_dashboard_stats AS
SELECT 
    u.id as user_id,
    u.email,
    u.name,
    COUNT(DISTINCT ed.id) as total_files,
    COUNT(DISTINCT ar.id) as total_analyses,
    COUNT(DISTINCT r.id) as total_reports,
    MAX(ed.upload_date) as last_upload,
    MAX(ar.analyzed_at) as last_analysis
FROM users u
LEFT JOIN ecommerce_data ed ON u.id = ed.user_id
LEFT JOIN analysis_results ar ON u.id = ar.user_id
LEFT JOIN reports r ON u.id = r.user_id
GROUP BY u.id, u.email, u.name;

-- 注释
COMMENT ON TABLE users IS '系统用户表';
COMMENT ON TABLE ecommerce_data IS '电商原始数据表';
COMMENT ON TABLE analysis_results IS '数据分析结果表';
COMMENT ON TABLE reports IS '分析报告表';
COMMENT ON TABLE templates IS '数据模板表';
COMMENT ON TABLE user_settings IS '用户设置表';
COMMENT ON VIEW user_dashboard_stats IS '用户仪表板统计视图';