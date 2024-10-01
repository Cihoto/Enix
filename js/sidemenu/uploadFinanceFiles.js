

const uploadFinanceFilesSideMenu = document.getElementById('sidemenuenueun');

function openUploadFinanceFiles() {
    console.log('openUploadFinanceFiles',uploadFinanceFilesSideMenu);
    uploadFinanceFilesSideMenu.classList.add('active');
}
function closeUploadFinanceFiles() {
    uploadFinanceFilesSideMenu.classList.remove('active');
}
