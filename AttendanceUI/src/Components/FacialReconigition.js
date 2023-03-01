
import React from "react";


function FaceRecognition(elem) {
    let apiKey = document.getElementById("apiKey").value;
    let formData = new FormData();
    let photo = elem.files[0];

    formData.append("file", photo);

    fetch('http://localhost:8000/api/v1/recognition/recognize',
        {
            method: "POST",
            headers: {
                "x-api-key": '6b447d65-7b43-4e94-ada9-cf54e57bdf16',
            },
            body: formData
        }
    ).then(r => r.json()).then(
        function (data) {
            document.getElementById("result").innerHTML = JSON.stringify(data);
        })
        .catch(function (error) {
            alert('Request failed: ' + JSON.stringify(error));
        });

    //converting "image source" (url) to "Base64"
    const toDataURL = url => fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        }))



}
export default FaceRecognition;