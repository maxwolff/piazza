(function(window, document, undefined) {

    // pane elements
    var rightPane = document.getElementById('right-pane');
    var leftPane = document.getElementById('left-pane');
    var interactor = document.getElementById('interactors');



    // button and input elements
    // TODO: add button/input element selectors here
    
    // script elements that correspond to Handlebars templates
    var questionFormTemplate = document.getElementById('question-form-template');
    // TODO: add other script elements corresponding to templates here

    // compiled Handlebars templates
    var questionHandlebars = document.getElementById('questions-template');
    var responseForm = document.getElementById('expanded-question-template');
    var templates = {
        renderQuestionForm: Handlebars.compile(questionFormTemplate.innerHTML),
        renderQuestion: Handlebars.compile(questionHandlebars.innerHTML), 
        renderResponseForm: Handlebars.compile(responseForm.innerHTML)
    };


    /* Returns the questions stored in localStorage. */
    function getStoredQuestions() {
        if (!localStorage.questions) {
            // default to empty array
            localStorage.questions = JSON.stringify([]);
        }
        return JSON.parse(localStorage.questions);
    }
    // Store the given questions array in localStorage.
    function storeQuestions(questions) {
        localStorage.questions = JSON.stringify(questions);
    }

    // display question form, put data in localstorage on submit event
    //trigger add listeners for the questions on rightpane, event creates response form
    function saveQuestion(){
        rightPane.innerHTML = templates.renderQuestionForm();
        var questionForm = document.getElementById("question-form");
        questionForm.addEventListener('click', function(event){
            event.preventDefault();
            var target = event.target;
            var submit = document.querySelector("input.btn");
            if (target === submit){
                var textArea = questionForm.querySelector('textarea').value;
                var nameInput = questionForm.querySelector('input[type="text"]').value;
                var newEntry = {
                    subject: nameInput, 
                    question: textArea,
                    id: Math.random(),
                    responses: []
                    }
                var oldList = getStoredQuestions();
                oldList.push(newEntry);
                storeQuestions(oldList);
                var questionHtml = templates.renderQuestion({ 
                    questions: getStoredQuestions()
                });
                leftPane.innerHTML = questionHtml;
                questionForm.querySelector('textarea').value = "";
                questionForm.querySelector('input[type="text"]').value = "";            
                addListeners();
            }
        });
    }
    // adds listeners to the question just submitted on the question form
    function addListeners(){
        var allQuestions = document.getElementsByClassName("question-info");
        var lastQuestion = allQuestions[allQuestions.length - 1];
        lastQuestion.addEventListener('click', function(event){
            var target = event.target;
            var subject = lastQuestion.children[0];
            var question = lastQuestion.children[1];
            var responseHtml = templates.renderResponseForm({
                subject: subject.innerHTML, 
                question: question.innerHTML,
                responses: []
            });
            rightPane.innerHTML = responseHtml;
        });
    }

    function initQuestions(){
        if (localStorage.questions){
            var questionHtml = templates.renderQuestion({ 
                questions: getStoredQuestions()
            });
            leftPane.innerHTML = questionHtml;
            var questions = document.getElementsByClassName("question-info");
            for( var i = 0; i < questions.length; i ++){
                questions[i].addEventListener('click', function(event){
                    var target = event.target;
                    while(target.className !== "list-question question-info"){
                        target = target.parentNode;
                    }
                    console.log(target);
                    var localStorageJSON = getStoredQuestions();
                    console.log(localStorageJSON);
                    var targetQuestion = getQuestionbyId(target, localStorageJSON);
                    var responseHtml = templates.renderResponseForm({
                        subject: targetQuestion.subject, 
                        question: targetQuestion.question,
                        responses: targetQuestion.responses
                    });
                    rightPane.innerHTML = responseHtml;
                    addResponseListener(target.id);
                });
            }
        }   
    }
    function getQuestionbyId(target, localStorageJSON){
        var localQuestion;
            localStorageJSON.forEach(function(question){
                if (question.id === parseFloat(target.id)){
                    localQuestion = question;
                }
            });
        return localQuestion;
    }

// for submit response, triggered when response form is loaded

    function addResponseListener(id){
        var responseForm = document.getElementById("response-form");
        responseForm.addEventListener('submit',function(event){
            event.preventDefault();
            var target = event.target;
            var localStorageJSON = JSON.parse(localStorage.questions);
            // pass in id , not target, change get question by id to accept id not target
            var storedQuestion = getQuestionbyId(target, localStorageJSON);
            var name = this.querySelector('input[type= "text"]').value;
            var response = this.querySelector('textarea').value;
            storedQuestion.responses.push({name: name, response: response});
            var responseHtml = templates.renderResponseForm({
                subject: storedQuestion.subject, 
                question: storedQuestion.question,
                responses: storedQuestion.responses
            });
            storeQuestions(localStorageJSON);
            rightPane.innerHTML = responseHtml;
        });
        var resolve = document.querySelector('.resolve');
        resolve.addEventListener('click', function(event){
            rightPane.innerHTML = templates.renderQuestionForm({});
            var localStorageJSON = JSON.parse(localStorage.questions);
            var firstHalf; 
            for( var i = 0; i < id; i ++){
                firstHalf += localStorageJSON[id];
            }
            var secondHalf;
            for( var i = parseInt(id,10) + 1; i < localStorageJSON.length; i ++){
                secondHalf += localStorageJSON[id - 1];
            }
            var newQuestionsArray = firstHalf + secondHalf;
            localStorage.questions = JSON.stringify(newQuestionsArray);
            leftPane.innerHTML = templates.renderQuestion({
                questions: getStoredQuestions()
            });
        });

    };
// new question form button
    var newQuestionForm = interactor.children[0];
    newQuestionForm.addEventListener('click', function(event){
        saveQuestion();
    });

    saveQuestion();
    initQuestions();
})(this, this.document)



















