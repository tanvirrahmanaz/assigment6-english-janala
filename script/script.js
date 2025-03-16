
const lessonsContainer = document.getElementById('lessons-container');
const lessonDetails = document.getElementById('lesson-details');
const lessonText = document.getElementById('lesson-text');
const bannerSection = document.querySelector('section');
const navBar = document.querySelector('nav');
const faqSection = document.querySelectorAll('section')[2];
const loginForm = document.querySelector('form');
const logoutButton = document.getElementById('logout-button');
const learnBtn = document.getElementById('learn-button');
const faqBtn = document.getElementById('faq-button');

let activeBtn = null;

const spinner = document.createElement('div');
spinner.innerHTML = '<div class="text-center py-10">Loading...</div>';

async function fetchLessons() {
  const response = await fetch('https://openapi.programming-hero.com/api/levels/all');
  const { data } = await response.json();

  data.forEach(lesson => {
    const button = document.createElement('button');
    button.className = 'inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-300 font-semibold';
    button.innerHTML = `<img src="assets/fa-book-open.png" class="h-5 w-5 mr-1"> Lesson-${lesson.level_no}`;
    button.addEventListener('click', () => {
      if (activeBtn) {
        activeBtn.classList.remove('bg-blue-600', 'text-white');
        activeBtn.classList.add('text-blue-600'); // fallback color
      }
    
      button.classList.add('bg-blue-600', 'text-white');
      button.classList.remove('text-blue-600'); // remove old color if present
      activeBtn = button;
      loadLessonWords(lesson.level_no);
    });
    lessonsContainer.appendChild(button);
  });
}

async function loadLessonWords(levelNo) {
  lessonDetails.innerHTML = '';
  lessonDetails.appendChild(spinner);

  try {
    const response = await fetch(`https://openapi.programming-hero.com/api/level/${levelNo}`);
    const result = await response.json();
    const data = result.data;

    lessonDetails.innerHTML = '';

    if (!data || data.length === 0) {
      lessonDetails.innerHTML = `
        <div class="text-center py-16">
          <img src="assets/alert-error.png" class="mx-auto mb-4 w-10">
          <p class=" text-gray-600">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
          <p class="text-2xl font-bold text-gray-600">নেক্সট Lesson এ যান</p>
        </div>`;
      return;
    }

    const cards = document.createElement('div');
    cards.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

    data.forEach(word => {
      const card = document.createElement('div');
      card.className = 'border border-blue-300 p-4 rounded-lg shadow-sm';
      card.innerHTML = `
        <h3 class="text-xl font-bold">${word.word || 'N/A'}</h3>
        <p class="text-sm text-gray-600">Meaning /Pronunciation</p>
        <p class="text-lg">${word.meaning || 'N/A'} / ${word.pronunciation || 'N/A'}</p>
        <div class=\"flex justify-between mt-4\">
  <button onclick=\"showDetails(${word.id})\" class=\"bg-blue-100 p-2 rounded-md text-blue-800\"><i class=\"fa-solid fa-circle-info\"></i></button>
  <button onclick=\"playAudio('${word.word}')\" class=\"bg-blue-100 p-2 rounded-md text-blue-800\"><i class=\"fa-solid fa-volume-low\"></i></button>
</div>`;
      cards.appendChild(card);
    });
    lessonDetails.appendChild(cards);
  } catch (error) {
    lessonDetails.innerHTML = `<p class='text-center text-red-600'>Error loading words. Please try again.</p>`;
  }
}

function playAudio(word) {
  alert(`Playing pronunciation for: ${word}`);
}

async function showDetails(id) {
  const res = await fetch(`https://openapi.programming-hero.com/api/word/${id}`);
  const { data } = await res.json();

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white p-6 rounded-lg max-w-md w-full text-left">
      <h3 class="text-2xl font-bold mb-2">${data.word} (${data.pronunciation || 'N/A'})</h3>
      <p class="mb-2"><strong>Meaning:</strong> ${data.meaning}</p>
      <p class="mb-2"><strong>Example:</strong> ${data.sentence || 'N/A'}</p>
      <p class="mb-2"><strong>Synonyms:</strong> ${(data.synonyms || []).join(', ')}</p>
      <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md" onclick="this.closest('.fixed').remove()">Complete Learning</button>
    </div>`;
  document.body.appendChild(modal);
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = loginForm.querySelector('input[type="text"]').value.trim();
  const pass = loginForm.querySelector('input[type="password"]').value.trim();

  if (!name) return alert('Please enter your name');
  if (pass !== '123456') return alert('Wrong password');

  alert('Login successful!');
  bannerSection.style.display = 'none';
  navBar.style.display = 'flex';
  faqSection.style.display = 'block';
  lessonsContainer.parentElement.style.display = 'block';
});

logoutButton.addEventListener('click', () => {
  bannerSection.style.display = 'flex';
  navBar.style.display = 'none';
  faqSection.style.display = 'none';
  lessonsContainer.parentElement.style.display = 'none';
});

learnBtn.addEventListener('click', () => {
  lessonsContainer.scrollIntoView({ behavior: 'smooth' });
});

faqBtn.addEventListener('click', () => {
  faqSection.scrollIntoView({ behavior: 'smooth' });
});

const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isHidden = answer.classList.contains('hidden');
    document.querySelectorAll('.faq-answer').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.faq-icon').forEach(icon => icon.textContent = '+');
    if (isHidden) {
      answer.classList.remove('hidden');
      btn.querySelector('.faq-icon').textContent = '-';
    }
  });
});

window.addEventListener('DOMContentLoaded', () => {
  fetchLessons();
  navBar.style.display = 'none';
  faqSection.style.display = 'none';
  lessonsContainer.parentElement.style.display = 'none';
  document.body.classList.add('flex', 'flex-col', 'min-h-screen');
  document.querySelector('footer').classList.add('mt-auto');
});
