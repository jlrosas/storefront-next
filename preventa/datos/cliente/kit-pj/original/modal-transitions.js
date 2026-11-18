window.openAnimatedDialog = dialog => {
  if (dialog.open) {
    return;
  }

  dialog.classList.remove('is-closing');
  dialog.showModal();
};

window.closeAnimatedDialog = dialog => {
  if (!dialog.open || dialog.classList.contains('is-closing')) {
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dialog.close();
    return;
  }

  dialog.classList.add('is-closing');
  window.setTimeout(() => {
    dialog.classList.remove('is-closing');
    if (dialog.open) {
      dialog.close();
    }
  }, 300);
};
