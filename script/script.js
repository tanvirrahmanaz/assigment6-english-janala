const lessonsContainer = document.getElementById('lessons-container');
  const lessonText = document.getElementById('lesson-text');

  // Fetch lessons from API
  async function fetchLessons() {
    const response = await fetch('https://openapi.programming-hero.com/api/levels/all');
    const { data } = await response.json();

    data.forEach(lesson => {
      const button = document.createElement('button');
      button.className = 'inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition';
      button.innerHTML = `<img src="assets/fa-book-open.png" alt="Learn" class="h-5 w-5 mr-1"> Lesson- ${lesson.level_no}`;
      button.onclick = () => showLesson(lesson);

      lessonsContainer.appendChild(button);
    });
  }

  // Display lesson details
  function showLesson(lesson) {
    lessonText.innerText = `Selected: ${lesson.lessonName}`;
  }

  // Initialize with default text
  document.addEventListener('DOMContentLoaded', fetchLessons);