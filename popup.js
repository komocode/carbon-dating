'use strict';

const DEFAULT_PROVIDER = 'flightera';

// Load saved preference and check the right radio
chrome.storage.sync.get({ provider: DEFAULT_PROVIDER }, ({ provider }) => {
  const radio = document.querySelector(`input[value="${provider}"]`);
  if (radio) radio.checked = true;
});

// Save on change and briefly show confirmation
document.querySelectorAll('input[name="provider"]').forEach(radio => {
  radio.addEventListener('change', () => {
    chrome.storage.sync.set({ provider: radio.value }, () => {
      const saved = document.getElementById('saved');
      saved.style.display = 'block';
      setTimeout(() => { saved.style.display = 'none'; }, 1200);
    });
  });
});
