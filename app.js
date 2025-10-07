let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let mode = 'sequential';
let questionOrder = [];

// 加载题库
async function loadQuestions() {
    const selectedBank = JSON.parse(localStorage.getItem('selectedBank'));
    if (!selectedBank) {
        alert('❌ 未选择题库');
        location.href = 'select.html';
        return;
    }

    try {
        // 🔧 关键修改：检查是否为本地题库
        if (selectedBank.file === 'local' && selectedBank.questions) {
            // 本地题库：直接使用 questions 字段
            questions = selectedBank.questions;
            console.log(`✅ 加载本地题库: ${selectedBank.name} (${questions.length} 题)`);
        } else {
            // 在线题库：从服务器加载
            const response = await fetch(selectedBank.file, {
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            questions = await response.json();
            console.log(`✅ 加载在线题库: ${selectedBank.name} (${questions.length} 题)`);
        }

        // 验证数据格式
        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error('题库数据格式错误或为空');
        }

        userAnswers = new Array(questions.length).fill(null);
        questionOrder = questions.map((_, i) => i);
        initQuiz();
        
    } catch (error) {
        console.error('❌ 加载题库失败:', error);
        alert(`加载题库失败\n\n错误信息: ${error.message}\n\n请返回重新选择题库`);
        location.href = 'select.html';
    }
}

// 初始化答题
function initQuiz() {
    renderQuestionNumbers();
    showQuestion();
}

// 渲染题号
function renderQuestionNumbers() {
    const container = document.getElementById('question-numbers');
    container.innerHTML = '';
    
    questionOrder.forEach((originalIndex, displayIndex) => {
        const numBtn = document.createElement('div');
        numBtn.className = 'q-num unanswered';
        numBtn.textContent = displayIndex + 1;
        numBtn.onclick = () => jumpToQuestion(displayIndex);
        
        if (userAnswers[originalIndex] !== null) {
            const isCorrect = userAnswers[originalIndex] === questions[originalIndex].correctAnswer;
            numBtn.className = `q-num ${isCorrect ? 'correct' : 'incorrect'}`;
        }
        
        container.appendChild(numBtn);
    });
}

// 显示题目
function showQuestion() {
    const originalIndex = questionOrder[currentQuestionIndex];
    const question = questions[originalIndex];
    
    document.getElementById('question-number').textContent = `第 ${currentQuestionIndex + 1} 题 / 共 ${questions.length} 题`;
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'option';
        optionEl.textContent = option;
        
        if (mode === 'view') {
            if (index === question.correctAnswer) {
                optionEl.classList.add('correct');
            }
        } else {
            if (userAnswers[originalIndex] === null) {
                optionEl.onclick = () => selectAnswer(index, originalIndex);
            } else {
                optionEl.classList.add('disabled');
                if (index === question.correctAnswer) {
                    optionEl.classList.add('correct');
                }
                if (userAnswers[originalIndex] === index && index !== question.correctAnswer) {
                    optionEl.classList.add('incorrect');
                }
            }
        }
        
        optionsContainer.appendChild(optionEl);
    });
    
    const explanationEl = document.getElementById('explanation');
    if (mode === 'view' || (userAnswers[originalIndex] !== null && userAnswers[originalIndex] !== question.correctAnswer)) {
        explanationEl.textContent = question.explanation || '暂无解析';
        explanationEl.classList.add('show');
    } else {
        explanationEl.classList.remove('show');
    }
    
    updateNavigationButtons();
}

// 选择答案
function selectAnswer(selectedIndex, originalIndex) {
    const question = questions[originalIndex];
    userAnswers[originalIndex] = selectedIndex;
    
    const options = document.querySelectorAll('.option');
    options.forEach(opt => {
        opt.classList.add('disabled');
        opt.onclick = null;
    });
    
    options[selectedIndex].classList.add('selected');
    
    if (selectedIndex !== question.correctAnswer) {
        options[selectedIndex].classList.add('incorrect');
        options[question.correctAnswer].classList.add('correct');
        document.getElementById('explanation').textContent = question.explanation || '暂无解析';
        document.getElementById('explanation').classList.add('show');
    } else {
        options[selectedIndex].classList.add('correct');
    }
    
    renderQuestionNumbers();
}

// 切换模式
function changeMode() {
    mode = document.getElementById('mode-select').value;
    
    if (mode === 'random') {
        questionOrder = [...Array(questions.length).keys()].sort(() => Math.random() - 0.5);
    } else {
        questionOrder = questions.map((_, i) => i);
    }
    
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length).fill(null);
    renderQuestionNumbers();
    showQuestion();
}

// 上一题
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

// 下一题
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    }
}

// 跳转到指定题目
function jumpToQuestion(index) {
    currentQuestionIndex = index;
    showQuestion();
}

// 更新导航按钮状态
function updateNavigationButtons() {
    document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
    document.getElementById('next-btn').disabled = currentQuestionIndex === questions.length - 1;
}

// 页面加载时初始化
window.onload = loadQuestions;