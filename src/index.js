document.addEventListener('DOMContentLoaded', function () {
    var filterState = false;


    fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then(data => {
            let dogBar = document.getElementById('dog-bar');
            let filterBtn = document.getElementById('good-dog-filter');
            updateFilterUI();

            filterBtn.addEventListener('click', function () {
                filterState = !filterState;

                updateFilterUI();
            });

            function updateFilterUI() {
                filterBtn.textContent = 'Filter good dogs: ' + (filterState ? 'ON' : 'OFF');

                dogBar.innerHTML = '';

                data.forEach(pup => {
                    if (!filterState || (filterState && pup.isGoodDog)) {
                        var spanElement = document.createElement('span');
                        spanElement.textContent = pup.name;

                        spanElement.addEventListener('click', function () {

                            displayDogInfo(pup);
                        });


                        dogBar.appendChild(spanElement);
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching pup data:', error));

    function displayDogInfo(pup) {

        let dogInfo = document.getElementById('dog-info');

        dogInfo.innerHTML = '';


        let imgElement = document.createElement('img');
        imgElement.src = pup.image;

        let h2Element = document.createElement('h2');
        h2Element.textContent = pup.name;

        let buttonElement = document.createElement('button');
        buttonElement.textContent = pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';

        buttonElement.addEventListener('click', function () {

            pup.isGoodDog = !pup.isGoodDog;

            buttonElement.textContent = pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';

            fetch('http://localhost:3000/pups/' + pup.id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isGoodDog: pup.isGoodDog }),
            })
                .then(response => response.json())
                .then(updatedPup => console.log('Pup updated:', updatedPup))
                .catch(error => console.error('Error updating pup:', error));
        });

        dogInfo.appendChild(imgElement);
        dogInfo.appendChild(h2Element);
        dogInfo.appendChild(buttonElement);
    }
});


