
let countSpan = document.querySelector(".quiz-info .count");

let bulletsSpanContainer = document.querySelector(".bullets .spans");

let quizArea = document.querySelector(".quiz-area");

let answersArea = document.querySelector(".answers-area");

let submitButton = document.querySelector(".submit-button");

let bullets = document.querySelector(".bullets");

let results = document.querySelector(".results");

let countdownElement = document.querySelector(".countdown");


let currentIndex = 0;

let rightAnswers = 0;

let countdownInterval;


function getQuestions(){
    let myRequest = new XMLHttpRequest();
    
    myRequest.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            
            let questionsObject = JSON.parse(this.responseText);
            
            let questionCount = questionsObject.length;
            
            console.log(questionCount)
            
            createBullets(questionCount);
            
            addQuestionData(questionsObject[currentIndex], questionCount);
            
            
            countdown(3, questionCount);
            
            submitButton.onclick = () =>{
                
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                
                currentIndex ++;
                
                checkAnswer(theRightAnswer, questionCount);
                
                quizArea.innerHTML = "";
                
                answersArea.innerHTML = "";
                
                addQuestionData(questionsObject[currentIndex], questionCount);
                
                handleBullets();
                
                clearInterval(countdownInterval);
                
                countdown(3, questionCount);
                
                showResults(questionCount);
                
            }
        }
    }
    
    myRequest.open("GET", "Questions.json", true);
    
    myRequest.send();
}

getQuestions();


function createBullets(num){
    countSpan.innerHTML = num;
    
    for(let i = 0; i < num; i++){
        
        let theBullet = document.createElement("span");
        
        if(i === 0){
            theBullet.className = "on";
        }
        
        bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj , count){
    
    if(currentIndex < count){
    
    let questionTitle = document.createElement("h2");
    
    let questionText = document.createTextNode(obj['title']);
    
    questionTitle.appendChild(questionText);
    
    quizArea.appendChild(questionTitle);
    
    for(let i = 1; i <= 4; i++){
        
        let mainDiv = document.createElement("div");
        
        mainDiv.className = 'answer';
        
        let radioInput = document.createElement("input");
        
        radioInput.name = 'question';
        
        radioInput.type = 'radio';
        
        radioInput.id = `answer_${i}`;
        
        radioInput.dataset.answer = obj[`answer_${i}`];
        
        if(i === 1){
            radioInput.checked = true;
        }
        
        let theLabel = document.createElement("label");
        
        theLabel.htmlFor = `answer_${i}`;
        
        let theLabelText = document.createTextNode(obj[`answer_${i}`]);
        
        theLabel.appendChild(theLabelText);
        
        mainDiv.appendChild(radioInput);
        
        mainDiv.appendChild(theLabel);
        
        answersArea.appendChild(mainDiv);
    }
}
}

function checkAnswer(rAnswer, count){
    let answers = document.getElementsByName("question");
    
    let theChoosenAnswer;
    
    for(let i = 0; i < answers.length; i++){
        
        if(answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    
    if(rAnswer === theChoosenAnswer){
        rightAnswers++;
        console.log("Good")
    }
}

function handleBullets(){
    let bulletsSpan = document.querySelectorAll(".bullets .spans span");
    
    let arrayOfSpans = Array.from(bulletsSpan);
    
    arrayOfSpans.forEach((span, index) => {
        if(currentIndex === index){
            span.classList = "on"
        }
    })
}

function showResults(count){
    let theResults;
    if(currentIndex === count){
        quizArea.remove();
        
        answersArea.remove();
        
        submitButton.remove();
        
        bullets.remove();
        
        if(rightAnswers > count/2 && rightAnswers < count){
            theResults = `<span  class = "good">Good</span>, ${rightAnswers} From ${count}`;
        }
        else if(rightAnswers === count){
            theResults = `<span  class = "perfect">Perfect</span>, All Answers Are Good`;
        }
        else{
            theResults = `<span  class = "bad">Bad</span>, ${rightAnswers} From ${count}`;
        }
        results.innerHTML = theResults;
        results.style.padding = "10px";
        results.style.backgroundColor = "white";
        results.style.marginTop = "10px";
    }
}

function countdown(duration, count) {
    if (currentIndex < count) {
      let minutes, seconds;
      countdownInterval = setInterval(function () {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);
  
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
  
        countdownElement.innerHTML = `${minutes}:${seconds}`;
  
        if (--duration < 0) {
          clearInterval(countdownInterval);
          submitButton.click();
        }
      }, 1000);
    }
  }