
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('settingsForm');
    const userNameInput = document.getElementById('userName');
    const wakaApiKeyInput = document.getElementById('wakaApiKey');
    const wakaApiUrlInput = document.getElementById('wakaApiUrl');
    const saveButton = document.getElementById('saveButton');
    const clearButton = document.getElementById('clearButton');
    const statusDiv = document.getElementById('status');

    loadSettings();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings();
    });

    clearButton.addEventListener('click', function() {
        clearSettings();
    });

    function loadSettings() {
        let name = localStorage.getItem('name');
        let id = localStorage.getItem('id');
        let apiUrl = localStorage.getItem('apiUrl');
        if (name) {
            userNameInput.value = name;
        }
        if (id) {
            wakaApiKeyInput.value = id;
        }
        if (apiUrl) {
            wakaApiUrlInput.value = apiUrl;
        }
    }

    function saveSettings() {
        const userName = userNameInput.value.trim();
        const wakaApiKey = wakaApiKeyInput.value.trim();
        const wakaApiUrl = wakaApiUrlInput.value.trim();

        if (!userName) {
            showStatus('Please enter your name', 'error');
            return;
        }
        localStorage.setItem('name', userName);
        localStorage.setItem('id', wakaApiKey);
        localStorage.setItem('apiUrl', wakaApiUrl);
        
        showStatus('Settings saved successfully!', 'success');
    }

    function clearSettings() {
        localStorage.removeItem('name');
        localStorage.removeItem('id');
        localStorage.removeItem('apiUrl');
        
        userNameInput.value = '';
        wakaApiKeyInput.value = '';
        wakaApiUrlInput.value = '';
        
        showStatus('Settings cleared successfully!', 'success');
    }

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status-message ${type}`;
        setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.className = 'status-message';
        }, 3000);
    }
});
