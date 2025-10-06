let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let mode = 'sequential';
let questionOrder = [];

// 加载题库
async function loadQuestions() {
    const selectedBank = JSON.parse(localStorage.getItem('selectedBank'));
    if (!selectedBank) {
        location.href = 'select.html';
        return;
    }

    try {
        const response = await fetch(selectedBank.file);
        questions = await response.json();
        userAnswers = new Array(questions.length).fill(null);
        questionOrder = questions.map((_, i) => i);
        initQuiz();
    } catch (error) {
        alert('加载题库失败，请检查文件路径');
        console.error(error);
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