/**
 * 自动扫描 data 文件夹中的所有 .json 文件
 * 生成题库索引文件 data/index.json
 */

const fs = require('fs');
const path = require('path');

const dataDir = './data';
const outputFile = './data/index.json';

console.log('🔍 开始扫描题库文件...\n');

try {
    // 确保 data 文件夹存在
    if (!fs.existsSync(dataDir)) {
        console.error('❌ data 文件夹不存在！');
        process.exit(1);
    }

    // 读取 data 文件夹中的所有 .json 文件
    const files = fs.readdirSync(dataDir)
        .filter(file => {
            // 排除 index.json 本身
            return file.endsWith('.json') && file !== 'index.json';
        })
        .map(file => {
            const filePath = path.join(dataDir, file);
            
            try {
                const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                
                // 验证是否为有效的题库文件
                if (Array.isArray(content) && content.length > 0) {
                    // 检查第一题的格式
                    const firstQuestion = content[0];
                    if (firstQuestion.question && 
                        firstQuestion.options && 
                        firstQuestion.correctAnswer !== undefined) {
                        
                        const fileName = file.replace('.json', '');
                        
                        console.log(`✓ ${file} (${content.length}题)`);
                        
                        return {
                            id: fileName,
                            name: fileName,
                            file: `data/${file}`,
                            questionCount: content.length
                        };
                    } else {
                        console.log(`⚠ ${file} - 格式不正确，跳过`);
                    }
                } else {
                    console.log(`⚠ ${file} - 不是有效的题库数组，跳过`);
                }
            } catch (err) {
                console.log(`⚠ ${file} - JSON 解析失败，跳过`);
            }
            
            return null;
        })
        .filter(item => item !== null);

    // 生成索引文件
    const index = {
        lastUpdated: new Date().toISOString(),
        totalBanks: files.length,
        totalQuestions: files.reduce((sum, bank) => sum + bank.questionCount, 0),
        banks: files
    };

    fs.writeFileSync(outputFile, JSON.stringify(index, null, 2), 'utf8');
    
    console.log('\n✅ 题库索引生成成功！');
    console.log(`📊 统计: ${index.totalBanks} 个题库，共 ${index.totalQuestions} 道题目`);
    console.log(`📁 输出文件: ${outputFile}\n`);

} catch (error) {
    console.error('❌ 生成索引失败:', error);
    process.exit(1);
}