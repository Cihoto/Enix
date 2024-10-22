<?php 
    function getFileTime($file_url = false) {
        if (!file_exists($file_url)) {
            return '';
        }
        return filemtime($file_url);
    }
?>