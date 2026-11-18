const journeyDetailDialog = document.querySelector('#journeyDetailDialog');
const journeyDialogTitle = document.querySelector('#journeyDialogTitle');
const journeyDialogStory = document.querySelector('#journeyDialogStory');
const journeyDialogExpectation = document.querySelector('#journeyDialogExpectation');
const journeyDialogTag = document.querySelector('#journeyDialogTag');
const journeyDialogClose = document.querySelector('.journey-dialog-close');
const journeyTrack = document.querySelector('#journeyTrack');

function showJourneyDetail(index) {
  const step = window.journeySteps[index];
  if (!step) {
    return;
  }

  journeyDialogTitle.textContent = step.title;
  journeyDialogStory.textContent = step.detail || step.story;
  journeyDialogExpectation.textContent = step.expectation;
  journeyDialogTag.textContent = step.tag;
  window.openAnimatedDialog(journeyDetailDialog);
}

journeyTrack.addEventListener('click', event => {
  const trigger = event.target.closest('.journey-detail-trigger');
  if (trigger) {
    showJourneyDetail(Number(trigger.dataset.journeyDetail));
  }
});

journeyDialogClose.addEventListener('click', () => window.closeAnimatedDialog(journeyDetailDialog));
journeyDetailDialog.addEventListener('click', event => {
  if (event.target === journeyDetailDialog) {
    window.closeAnimatedDialog(journeyDetailDialog);
  }
});
journeyDetailDialog.addEventListener('cancel', event => {
  event.preventDefault();
  window.closeAnimatedDialog(journeyDetailDialog);
});
