const levelUpBlockHtml = `
<div class="profile_customization_header ellipsis">Test</div>
  <div class="profile_customization_block">
    <div class="customtext_showcase">
      <div class="showcase_content_bg showcase_notes">
         
         <div class="avatar_AvatarDialogUploadArea_22Ena">
          
           <input type="file" accept=".text/csv"  class="DialogButton _DialogLayout Secondary Focusable" value="Test">
          
            <button type="button" class="DialogButton _DialogLayout Secondary Focusable" tabindex="0">Загрузите свой аватар
             <input type="file" accept=".text/csv"  class="DialogButton _DialogLayout Secondary Focusable">
            </button>
         </div>
      </div>
    </div>
  </div>
`;


const levelUpBlock = document.createElement("div");


levelUpBlock.innerHTML = levelUpBlockHtml;
levelUpBlock.setAttribute("data-panel", "{&quot;type&quot;:&quot;PanelGroup&quot;}");
levelUpBlock.className = "profile_customization";
levelUpBlock.style.display = "none";

export const template = () => {
  return levelUpBlock;
};