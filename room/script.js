let atWorst =
[
    'A bad listener',
    'Insecrue',
    'Annoying',
    'Irresponsible',
    'Lazy',
    'Boastful',
    'Judgemental',
    'Bossy',
    'Rebellious',
    'Defensive',
    'Selfish',
    'Disrespectful',
    'Self-righteous',
    'Envious',
    'Uncaring',
    'Greedy',
    'Uncooperative',
    'Rude',
    'Ungrateful',
    'Impatient',
    'Inconsiderate'
]

let atBest = 
[
    'A Good Communicator',
    'Helpful',
    'A good Leader',
    'Humble',
    'A Good Listener',
    'Joyful',
    'Accepting',
    'kind',
    'Adventurous',
    'Out-going',
    'Compassionate',
    'Patient',
    'Confident',
    'Perservant',
    'Cooperative',
    'Optimistic',
    'Hard-working',
    'Punctual',
    'Encouraging',
    'Respectful',
    'Focused',
    'Sincere',
    'Forgiving',
    'Supportive',
    'Funny',
    'Trustworthy-loyal',
    'Generous',
    'Warm',
    'Gentle',
    'Grateful'
]

let sitWorst = [
    'Being Tired',
    'Daily Demands-job',
    'Being Hungry',
    'Being Alone',
    'Financial Pressure',
    'Being Disrespected',
    'Negative Peer Pressure',
    'Being Rejected',
    'Being Rushed',
    'Being Late',
    'External Pressure',
    'Being Critisized',
    'Internal Pressure',
    'Disappointment',
    'Too Much Free Time',
    'Busyness',
    'Too Much Unhealthy Food',
    'When Others Disagree With Me',
    'Lack of Exercise',
    'Not Getting My Own Way',
    'Being Distracted by Technology',
    'Focusing on Gaining Aprroval of Others'
]

let sitBest = [
    'Getting Enough Rest',
    'Havng Someone Listen to Me',
    'Good Nutrition',
    'Getting a Hug',
    'Encouraging Words',
    'Music or Media',
    'Hearing Inspiring Stories',
    'Being in Nature',
    'Reading',
    'Helping Others',
    'Time Alone',
    'Good Instructions',
    'Participating in Clubs',
    'Recieve Constructive Feedback',
    'Practicing Improving My Skills',
    'Being Around Positive People',
    'Excercise',
    'Being Prepared',
    'Challenging Opportunities'
]

let formFlow = [atWorst, sitWorst, atBest, sitBest]
let formTopic = ['At My Worst, I am ...',
'Situations that Can Bring Out My Worst are ...', 
'At My Best, I am ...',
'Situations that Can Bring Out My Best are ...']
formFlowFactor = 0 //where you are at in the form rn

// signaling finshied
let finished = false

let draggables
let containers
let mainContainers
let currentCardAmt = 0

// animations
let hideText
let showText
let hideOpacity
let showOpactiy

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild; 
}

function addCard(cards,container){
    const template = `<div class="draggableCard" draggable="true"> <p class="cardText"></p> </div>`
    cards.forEach(card => {
        let cardEle = createElementFromHTML(template);
        cardEle.querySelector(".cardText").innerHTML = card;
        container.appendChild(cardEle);
    })
}

function addCustomSection(container){
    const template = `<div class="draggableCard customDrag customBox" draggable="true"> <input></input> </div>`
    let cardEle = createElementFromHTML(template);
    container.appendChild(cardEle)
    cardEle.addEventListener('dragstart', () => {
        currentDragable = cardEle
    })
    cardEle.addEventListener('dragend', () => {
        currentDragable = ''
    })
    currentDragable = cardEle
}

function initAnims(){
    hideText = anime({
        autoplay:false,
        easing: 'easeOutQuart',
        targets:'#topic',
        translateY: [0,-60],
        duration:1000
    })

    showText = anime({
        autoplay:false,
        easing: 'easeOutQuart',
        targets:'#topic',
        translateY: [-60,0],
        duration:1000
    })

    hideOpacity = anime({
        autoplay:false,
        easing: 'easeOutQuart',
        targets: '.draggableCard',
        opacity: [1, 0],
        duration:1000
    })

    showOpactiy = anime({
        autoplay:false,
        easing: 'easeOutQuart',
        targets: '.draggableCard',
        opacity: [0, 1],
        duration:1000
    })
}

var currentDragable

window.onload = () => {
    addCard(formFlow[formFlowFactor], document.getElementById('cardSection'))
    draggables = document.querySelectorAll('.draggableCard')
    containers = document.querySelectorAll('.dragInSection')
    mainContainers = document.querySelectorAll('.cardContainer')

    // adding dragging events
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            const dragClone = draggable.cloneNode(true)
            dragClone.classList.add('cloned')
            dragClone.classList.add('dragging')
            dragClone.addEventListener('dragstart', () => {
                dragClone.classList.add('dragging')
                currentDragable = dragClone
            })
            dragClone.addEventListener('dragend', () => {
                dragClone.classList.remove('dragging')
                currentDragable = ''
            })
            
            currentDragable = dragClone
        })
        draggable.addEventListener('dragend', () => {
            currentDragable.classList.remove('dragging')
            currentDragable = ''
        })
    })


    containers.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault()
            // alert(draggable)
            container.appendChild(currentDragable)
        })
    })

    // add event for deleting the cards
    const cardContainer = document.querySelector('.deleteContainer')
    cardContainer.addEventListener('dragover', e => {
        e.preventDefault()
        // append and then get rid of it

        cardContainer.appendChild(currentDragable)
        cardContainer.removeChild(currentDragable)
    })

    // custom card event
    const maxCard = 1
    const customCardSection = document.querySelector('#customCardAppendix')
    const customCardBtn = document.querySelector('#customBtn')
    customCardBtn.addEventListener('click', () => {
        if(getCount(customCardSection, false) < maxCard){
            addCustomSection(customCardSection)
            currentCardAmt++
        }
    })

    // next button call
    document.querySelector('#doneBtn').addEventListener('click', () => {
        if (formFlowFactor < 3){
            hideText.play()
            setTimeout(() => {
                document.getElementById('topic').innerHTML = formTopic[formFlowFactor]
                mainContainers.forEach(container => {
                    container.innerHTML = ''
                    addCard(formFlow[formFlowFactor], document.getElementById('cardSection'))
                
                    draggables = document.querySelectorAll('.draggableCard')

                    draggables.forEach(draggable => {
                        draggable.addEventListener('dragstart', () => {
                            const dragClone = draggable.cloneNode(true)
                            dragClone.classList.add('cloned')
                            dragClone.classList.add('dragging')
                            dragClone.addEventListener('dragstart', () => {
                                dragClone.classList.add('dragging')
                                currentDragable = dragClone
                            })
                            dragClone.addEventListener('dragend', () => {
                                dragClone.classList.remove('dragging')
                                currentDragable = ''
                            })
                            
                            currentDragable = dragClone
                        })
                        draggable.addEventListener('dragend', () => {
                            currentDragable.classList.remove('dragging')
                            currentDragable = ''
                        })
                    })
                })
            }, 1000);
            setTimeout(() => {
                showText.play()
            }, 1100);

            formFlowFactor ++
        }
    })

    // init animation
    initAnims()

    showOpactiy.play()
    showText.play()
}

function getCount(parent, getChildrensChildren){
    var relevantChildren = 0;
    var children = parent.childNodes.length;
    for(var i=0; i < children; i++){
        if(parent.childNodes[i].nodeType != 3){
            if(getChildrensChildren)
                relevantChildren += getCount(parent.childNodes[i],true);
            relevantChildren++;
        }
    }
    return relevantChildren;
}