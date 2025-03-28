$(function() {
      toggleFold();
});

function toggleFold() {
  var section = document.getElementById('foldableSection');
  var arrow = section.querySelector('.arrow');
  var isFolded = section.classList.contains('folded');

  if (section.classList.contains('unfolded')) {
      section.classList.remove('unfolded');
      section.classList.add('folded');
      arrow.style.transform = 'rotate(-90deg)';
  } else {
      section.classList.remove('folded');
      section.classList.add('unfolded');
      arrow.style.transform = 'rotate(90deg)';
  }
}
document.addEventListener('DOMContentLoaded', (event) => {
  const studentAvatars = document.querySelectorAll('.student-avatar');
  
  // 使用Intersection Observer API来检测元素是否进入视口，并触发动画
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // 动画只触发一次
      }
    });
  }, {
    threshold: 0.1 // 当元素10%可见时触发动画
  });

  // 观察每个学生头像
  studentAvatars.forEach(avatar => {
    observer.observe(avatar);
  });
});
