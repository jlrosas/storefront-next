const profileGrid = document.querySelector('.profile-grid');
const profileCards = profileGrid?.querySelectorAll('.profile-card') ?? [];

function setProfileCardExpanded(card, isExpanded) {
  const button = card.querySelector('.profile-card-trigger');
  card.classList.toggle('is-expanded', isExpanded);
  button.setAttribute('aria-expanded', String(isExpanded));

  const detail = document.getElementById(button.getAttribute('aria-controls'));
  if (detail) {
    detail.hidden = !isExpanded;
  }
}

function toggleProfileCard(selectedCard, selectedButton) {
  const shouldExpand = selectedButton.getAttribute('aria-expanded') !== 'true';
  profileCards.forEach(card => setProfileCardExpanded(card, card === selectedCard && shouldExpand));
}

profileCards.forEach(card => {
  const button = card.querySelector('.profile-card-trigger');
  button.addEventListener('click', () => toggleProfileCard(card, button));
});

document.addEventListener('click', event => {
  const expandedCard = profileGrid?.querySelector('.profile-card.is-expanded');
  if (expandedCard && !expandedCard.contains(event.target)) {
    setProfileCardExpanded(expandedCard, false);
  }
});
