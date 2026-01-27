document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.navegacao ul');

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');

        toggle.setAttribute(
            'aria-expanded',
            menu.classList.contains('active')
        );
    });
});