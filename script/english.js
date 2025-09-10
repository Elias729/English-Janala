const createElement = (arr) => {
    const htmlElements = arr.map((el) => `<span class = "btn">${el}</span>`);
    return htmlElements.join(" ");
}

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN";
    window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
    if (status == true) {
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden');
    } else {
        document.getElementById('word-container').classList.remove('hidden');
        document.getElementById('spinner').classList.add('hidden');
    }
}

const loadLesson = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(response => response.json())
        .then(json => {
            displayLesson(json.data)
        });
}

const removeActive = () => {
    const lessonBtns = document.querySelectorAll(".lesson-btn");
    lessonBtns.forEach((btn) => btn.classList.remove("active"));
}


const loadLevelWord = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActive();
            const ClickBtn = document.getElementById(`lesson-btn-${id}`);
            ClickBtn.classList.add("active");
            displayLessonWord(data.data)
        });
}

const loadWordDetails = async (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data)
}

const displayWordDetails = (word) => {
    const detailsContainer = document.getElementById('details-container');
    detailsContainer.innerHTML = `
                 <div>
                    <h2 class="text-2xl font-bold font-bangla flex items-center gap-2">${word.word} <span
                            class="text-gray-500 text-lg">(<i class="ri-mic-2-ai-fill"></i>:${word.pronunciation})</span></h2>
                </div>
                <div>
                    <h2 class="text-xl font-semibold font-bangla mb-2 text-gray-700">Meaning</h2>
                    <p class="text-lg text-gray-600 font-bangla">${word.meaning}</p>
                </div>
                <div>
                    <h2 class="text-xl font-semibold mb-2 text-gray-700">Example</h2>
                    <p  class="text-gray-600 italic">${word.sentence}</p>
                </div>
                <div>
                    <h2 class="text-xl font-semibold font-bangla mb-3 text-gray-700">সমার্থক শব্দ গুলো</h2>
                    <div class="flex flex-wrap gap-2">${createElement(word.synonyms)}</div>
                </div>
    
    
    `;
    document.getElementById('word_modal').showModal();
    manageSpinner(false)
};

const displayLessonWord = (words) => {
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = "";

    if (words.length === 0) {
        wordContainer.innerHTML = `
        <div class="text-center py-10 col-span-full font-bangla">
            <img  class="m-auto" src="./assets/alert-error.png" alt="alart">
            <p class="text-gray-500 text-lg mb-2">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="text-2xl font-bold text-gray-800">নেক্সট Lesson এ যান</h2>
        </div>
        `;
    };

    words.forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.innerHTML = `
        <div
    class="bg-white rounded-2xl shadow-md flex flex-col justify-between items-center text-center w-64 py-8 px-6 space-y-4 h-full">
    <h2 class="text-2xl font-bold text-gray-800 mb-2">${word.word ?  word.word : "কোন শব্দ পাওয়া যায়নি"}</h2>
    <p class="text-sm text-gray-500 mb-3">Meaning / Pronunciation</p>
    <div class="text-lg text-gray-700 font-medium mb-6 font-bangla">
        "${word.meaning ? word.meaning : "অর্থ নেই"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ নেই"}"
    </div>

    <div class="flex justify-between items-center w-full gap-4">
        <button  onclick="loadWordDetails(${word.id})" class="p-3 bg-sky-50 rounded-xl hover:bg-sky-100 transition cursor-pointer">
            <i class="ri-information-line text-xl text-sky-600"></i>
        </button>
        <button onclick = "pronounceWord('${(word.word)}')" class="p-3 bg-sky-50 rounded-xl hover:bg-sky-100 transition cursor-pointer">
            <i class="ri-volume-up-line text-xl text-sky-600"></i>
        </button>
    </div>
</div>

        `;

        wordContainer.appendChild(wordDiv);
    })
    manageSpinner(false);
};

const displayLesson = (lessons) => {
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = "";

    lessons.forEach(lesson => {
        const btnDiv = document.createElement('div');
        btnDiv.innerHTML = `
         <button id = "lesson-btn-${lesson.level_no}" onclick = "loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary flex items-center gap-2 hover:scale-105 transition lesson-btn">
                <img src="./assets/fa-book-open.png" alt="Book Icon" class="w-5 h-5"> Lesson -${lesson.level_no}
            </button>
        `;
        levelContainer.appendChild(btnDiv);
    });
};

loadLesson();

document.getElementById("btn-search").addEventListener("click", () => {
    removeActive();
    const input = document.getElementById("input-search");
    const searchValues = input.value.trim().toLowerCase();
    input.value = "";

    if (!searchValues) {
        return;
    }

    fetch("https://openapi.programming-hero.com/api/words/all")
        .then(res => res.json())
        .then(data => {
            const allWords = data.data;
            const filterWords = allWords.filter((word) => word.word.toLowerCase().includes(searchValues));
            displayLessonWord(filterWords);
        });
});