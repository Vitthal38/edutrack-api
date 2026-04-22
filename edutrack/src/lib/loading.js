export function showLoading(container, message = 'Loading…') {
  container.innerHTML = `
    <div class="loading">
      <div class="spinner" aria-hidden="true"></div>
      <p>${message}</p>
    </div>
  `;
}

export function showError(container, message, onRetry) {
  container.innerHTML = `
    <div class="error-state">
      <p class="error">${message}</p>
      ${onRetry ? '<button id="retry-btn">Retry</button>' : ''}
    </div>
  `;
  if (onRetry) {
    container.querySelector('#retry-btn')?.addEventListener('click', onRetry);
  }
}