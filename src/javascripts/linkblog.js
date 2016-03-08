(function(window, document) {
    window.addEventListener("load", function() {
        // Header
        var header = document.querySelector('header');
        var shown = false;

        header.addEventListener("mouseover", showHeader);
        header.addEventListener("mouseout", hideHeader);
        header.addEventListener("touchstart", function(){
            if(shown) hideHeader();
            else showHeader();
        });

        function showHeader(){
            header.querySelector('#h-dimin').setAttribute('class', 'hidden');
            header.querySelector('#h-full').setAttribute('class', 'show');
            header.querySelector('#header-nav').setAttribute('class', 'show');
            shown = true;
        }

        function hideHeader(){
            header.querySelector('#h-dimin').setAttribute('class', 'show');
            header.querySelector('#h-full').setAttribute('class', 'hidden');
            header.querySelector('#header-nav').setAttribute('class', 'hidden');
            shown = false;
        }

        // URL

        var urlField = document.querySelector("input[type='URL']");
        console.log(urlField);
        urlField.value = "http://";
        urlField.selectionStart = 0;
        urlField.selectionEnd = 7;

    });
})(window, document);
