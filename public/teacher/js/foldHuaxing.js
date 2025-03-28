$(function() {
    toggleFold1();
});

function toggleFold1() {
var section = document.getElementById('foldableSection1');
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
