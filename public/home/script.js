let textBoxFromBottom
let nextBtnAnim

window.onload = () => {
    // reset textbox content
    document.getElementById("nameBox").value = ""

    // animating textbox from bottom
    textBoxFromBottom = anime.timeline({
        autoplay:false,
        easing: 'easeOutQuart',
    })
    
    textBoxFromBottom.set('#nameBox, #nameText, #idBox', {
        translateY: 250,
        backgroundColor: 'transparent',
        color: 'transparent'
    })

    textBoxFromBottom.add({
        targets:'#nameBox, #idBox',
        translateY:0,
        backgroundColor: 'rgb(252, 252, 252)',
        color: 'rgb(80, 80, 80)',
        duration:1000
    })

    textBoxFromBottom.add({
        targets:'#nameText',
        translateY:0,
        color: '#fff',
        duration:1000
    },'-=1000')

    textBoxFromBottom.add({
        targets:'.titles',
        translateY:-30
    }, '-=700')

    // animating the button showing and disappearing
    nextBtnAnim = anime.timeline({
        autoplay:false,
        easing: 'easeOutQuart',
    })
    nextBtnAnim.set('#nextBtn', {
        translateY: 250,
        backgroundColor: 'transparent',
        color: 'transparent'
    })
    nextBtnAnim.add({
        targets:'#nextBtn',
        translateY: 10,
        backgroundColor: '#fff',
        color:"#000",
        duration:500
    })
    nextBtnAnim.reverse()
    
    document.getElementById('nextBtn').style.visibility = "hidden"
    document.getElementById('nameBox').style.visibility = "hidden"
    // document.getElementById('idBox').style.visibility = "hidden"
    document.getElementById('nameText').style.visibility = "hidden"
}

document.getElementById('startBtn').addEventListener('click', ()=>{
    document.getElementById('nameBox').style.visibility = "visible"
    document.getElementById('idBox').style.visibility = "visible"
    document.getElementById('nameText').style.visibility = "visible"

    textBoxFromBottom.play()
    document.getElementById('startBtn').disabled = true
})

let showing = false
setInterval(()=>{
    if(document.getElementById("nameBox").value && !showing){
        // if there is something, then show the next button. Or else hide it
        document.getElementById('nextBtn').style.visibility = "visible"
        nextBtnAnim.reverse()
        nextBtnAnim.play()
        showing = true
    } else if (!document.getElementById("nameBox").value && showing){
        nextBtnAnim.reverse()
        nextBtnAnim.play()
        showing=false
    } 
}, 10)

document.getElementById('')