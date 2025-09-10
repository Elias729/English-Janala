const loadLesson = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(response => response.json())
        .then(json => displayLesson(json.data));
}

const loadLevelWord = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => displayLessonWord(data.data))
}

const displayLessonWord = (words) => {
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = "";

    words.forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.innerHTML = `
        <div
    class="bg-white rounded-2xl shadow-md flex flex-col justify-between items-center text-center w-64 py-8 px-6 space-y-4 h-full">
    <h2 class="text-2xl font-bold text-gray-800 mb-2">${word.word}</h2>
    <p class="text-sm text-gray-500 mb-3">Meaning / Pronunciation</p>
    <div class="text-lg text-gray-700 font-medium mb-6 font-bangla">
        "${word.meaning} / ${word.pronunciation}"
    </div>

    <div class="flex justify-between items-center w-full gap-4">
        <button class="p-3 bg-sky-50 rounded-xl hover:bg-sky-100 transition cursor-pointer">
            <i class="ri-information-line text-xl text-sky-600"></i>
        </button>
        <button class="p-3 bg-sky-50 rounded-xl hover:bg-sky-100 transition cursor-pointer">
            <i class="ri-volume-up-line text-xl text-sky-600"></i>
        </button>
    </div>
</div>

        `;

        wordContainer.appendChild(wordDiv)
    })

}

const displayLesson = (lessons) => {
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = "";

    lessons.forEach(lesson => {
        const btnDiv = document.createElement('div');
        btnDiv.innerHTML = `
         <button onclick = "loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary flex items-center gap-2 hover:scale-105 transition">
                <img src="./assets/fa-book-open.png" alt="Book Icon" class="w-5 h-5"> Lesson -${lesson.level_no}
            </button>
        `;
        levelContainer.appendChild(btnDiv);
    });
}

loadLesson()