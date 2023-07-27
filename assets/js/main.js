window.onload = function() {
    const searchBox = document.getElementById('search-input');
    searchBox.onclick = function() {
        //alert("click");
    }

    // searchBox.addEventListener("change", (event) => {
    //     const keyword = getKeyword();
    //     const result = document.querySelector('#search-results');
    //     result.innerHTML = highlightWords(keyword);

    //     // const result = document.querySelectorAll('#search-results div p').textContent;

    // });
}


function getKeyword() {
    const searchBox = document.getElementById('search-input');
    const keyword = searchBox.value;
    return keyword;
}

function highlightWords(keyword) {
    const result = document.querySelector('#search-results');
        const resultContent = result.innerText;
        console.log(result);
        console.log(resultContent);
        
        let words = resultContent.split(' ');
        let output = '';

        for (let i = 0; i < words.length; i++) {
            let word = words[i];
            let replacementword = word;
        
            // 이 예시에서는 길이가 8 이상인 문자열을 class가 lightext인 span 태그로 감싸줬다.
            if (word == keyword) {
              replacementword = "<span style='color:red;'>" + word + '</span>';
            }
        
            // 변수 output에 공백과 변경된 문자열을 누적해서 합한다.
            output = output + ' ' + replacementword + ' ';
          }

          return output;
}