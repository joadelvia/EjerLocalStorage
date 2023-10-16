document.addEventListener("DOMContentLoaded", function () {
    const userForm = document.getElementById("userForm");
    const userList = document.getElementById("userList");
    let usersData = JSON.parse(localStorage.getItem("usersData")) || [];

    // Función para validar email
    function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return regex.test(email);
    }

    // Función para crear el nuevo item de la lista
  function createListItem(name, address, email) {
    // Crea nuevos elementos
    const listItem = document.createElement("li");
    const userInfo = document.createTextNode(`${name} : ${address} : ${email} : `);
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    // Establece atributos y contenido para los botones
    editButton.classList.add("edit");
    deleteButton.classList.add("delete");
    editButton.textContent = "Editar";
    deleteButton.textContent = "Borrar";

    // Agrega los elementos al elemento <li>
    listItem.appendChild(userInfo);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    return listItem;
  }

    // Función para agregar un usuario a la lista
    function addUserToList(name, address, email) {
        const listItem = createListItem(name, address, email);
        userList.appendChild(listItem);
    }

    // Función para borrar un usuario de la lista y del localStorage
    function deleteUser(event) {
        if (event.target.classList.contains("delete")) {
            const listItem = event.target.parentElement;
            const email = listItem.textContent.split(" : ")[2];
            usersData = usersData.filter(user => user.email !== email);
            localStorage.setItem("usersData", JSON.stringify(usersData));
            listItem.remove();
        }
    }

    // Función para cargar los datos de un usuario en el formulario para editar
    function editUser(event) {
        if (event.target.classList.contains("edit")) {
            const listItem = event.target.parentElement;
            const userArray = listItem.textContent.split(" : ");
            const name = userArray[0];
            const address = userArray[1];
            const email = userArray[2].trim();
            userForm.elements.name.value = name;
            userForm.elements.address.value = address;
            userForm.elements.email.value = email;
            userForm.dataset.editing = email;
            userForm.querySelector("button[type='submit']").textContent = "Editar Usuario";
            //userForm.dataset.editingListItem = listItem; // Almacena el elemento de lista a editar
            userForm.dataset.editingIndex = [...userList.children].indexOf(listItem); // Almacena el índice del elemento en la lista
        }
    }

    // Manejar el envío del formulario (Agregar o Editar usuario)
    userForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = userForm.elements.name.value;
        const address = userForm.elements.address.value;
        const email = userForm.elements.email.value;
        const editingIndex = parseInt(userForm.dataset.editingIndex);
        if (name && address && validateEmail(email)) {
            const listItem = createListItem(name, address, email)

            if (userForm.dataset.editing) {
                const emailToEdit = userForm.dataset.editing;
                usersData = usersData.map(user => {
                    if (user.email === emailToEdit) {
                        user.name = name;
                        user.address = address;
                        user.email = email;
                    }
                    return user;
                });

                // Reemplaza el elemento existente en el índice con el nuevo elemento

                userList.replaceChild(listItem, userList.children[editingIndex]);
                userForm.removeAttribute("data-editing");
                userForm.querySelector("button[type='submit']").textContent = "Agregar Usuario";
                
            } else {
                if (usersData.some(user => user.email === email)) {
                    alert('El email especificado ya existe en la lista');
                    return;
                }
                usersData.push({ name, address, email });
                addUserToList(name, address, email);
            }
            localStorage.setItem("usersData", JSON.stringify(usersData));
            userForm.reset();
        } else {
            alert('Alguno de los campos no es correcto');
        }
    });

    // Manejar clics en botones de borrar y editar
    userList.addEventListener("click", function (event) {
        deleteUser(event);
        editUser(event);
    });

    // Cargar usuarios almacenados en localStorage al cargar la página
    usersData.forEach(user => {
        addUserToList(user.name, user.address, user.email);
    });
});
