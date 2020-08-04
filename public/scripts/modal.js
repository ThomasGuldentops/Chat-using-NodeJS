        // ---- modal box


        $("#currentProfileImage").click((event) => {
            addBlockPage();
            addPopupBox("Choix d'avatar", "Veuillez cliquer sur l'avatar que vous voulez.");
            $('.modal-box').fadeIn();
        });

        
        //blackout the entire page
        function addBlockPage(){
            let blockPage = $('<div class="block-page"></div>');
            $(blockPage).appendTo('body');
        }

        //create modal
        function addPopupBox(title, description){
            let pop_up = $(`
            <div class="modal-box">
                <a href="#" class="modal-close"></a>
                
                <div class="inner-modal-box">
                    <h2>${title}</h2><p>${description}</p> 
                    <div class="content-inner-modal-box">                    
                        <div class="content-inner-modal-box-button">
                            <button type="button" class="btn btn-success btn-lg btn-radius" id="validateButton">Valider</button>
                        </div>
                    </div> 
                </div>
            </div>`);

            $(pop_up).appendTo('.block-page');          

            getAllPictures();

            $('.modal-close').click(function(){                
                closeModal();
            });
        }

        function getAllPictures(){
            socket.emit("getAllPictures");                        
        }

        function closeModal(){
            $('.picture-profile').remove();
            $('.block-page').fadeOut().remove();                    
            $(this).parent().fadeOut().remove();                    
        }
