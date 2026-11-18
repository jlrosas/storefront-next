const proposalExpectationCards = document.querySelectorAll('.proposal-expectation-card');
const reduceProposalMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceProposalMotion) {
  const proposalObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return;
        }

        const card = entry.target;
        card.classList.add('is-entering');
        card.addEventListener('animationend', () => card.classList.remove('is-entering'), { once: true });
        proposalObserver.unobserve(card);
      });
    },
    { threshold: 0.18 }
  );

  proposalExpectationCards.forEach(card => proposalObserver.observe(card));
}
