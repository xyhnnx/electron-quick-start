

window.onload = () => {
// 知乎
let btn1 = document.getElementsByClassName('TopstoryItem');
btn1 = [...btn1]
let arr = [];
btn1.forEach(e=>{
  arr.push(e.innerText)
})
alert(JSON.stringify(arr))
}