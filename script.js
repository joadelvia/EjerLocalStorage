document.addEventListener("DOMContentLoaded", function () {
  // Obtenemos los elementos html que vamos necesitar, el formulario y la lista
  const userForm = document.getElementById("userForm");
  const userList = document.getElementById("userList");
  let usersData = JSON.parse(localStorage.getItem("usersData")) || {}// Obtiene los datos de usuarios del localStorage o crea un objeto vacío si no existe


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

  // Función para borrar un usuario de la lista y del objeto usersData
  function deleteUser(event) {
    // Comprobamos que el elemento que ha disparado el evento contiene la clase delete
    if (event.target.classList.contains("delete")) {
      const listItem = event.target.parentElement; // Obtenemos el padre del botón que será el elemento li
      const userArray = listItem.textContent.split(" : "); // Obtenemos un array con los diferentes campos
      const email = userArray[2];
      delete usersData[email]; // Elimina el usuario del objeto usersData
      localStorage.setItem("usersData", JSON.stringify(usersData)); // Actualiza el localStorage
      userList.removeChild(listItem); // Elimina el usuario de la lista
    }
  }

  // Función para cargar los datos de un usuario en el formulario para editar
  function editUser(event) {
    // Comprobamos que el elemento que ha disparado el evento contiene la clase edit
    if (event.target.classList.contains("edit")) {
      const listItem = event.target.parentElement; // Obtenemos el padre del botón que será el elemento li
      const [name, address, email] = listItem.textContent.split(' : '); // Obtenemos el nombre, la dirección y el email

      // Rellena el formulario con los datos del usuario para editar
      document.getElementById("name").value = name;
      document.getElementById("address").value = address;
      document.getElementById("email").value = email;
      userForm.dataset.editing = email; // Marca que estamos editando este usuario
      userForm.dataset.editingIndex = [...userList.children].indexOf(listItem); // Almacena el índice del elemento en la lista
      userForm.querySelector("button[type='submit']").textContent = "Editar Usuario"; // Cambia el texto del botón
    }
  }

  // Manejar el envío del formulario (Agregar o Editar usuario)
  userForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;

    // Nos aseguramos de que los campos están rellenos y el email es de tipo email
    if (name && address && validateEmail(email)) {
      // Comprobamos que el email no existe
      if (!usersData.hasOwnProperty(email) || email === userForm.dataset.editing) {
        // Crea el nuevo elemento de la lista con los nuevos datos
        const listItem = createListItem(name, address, email)

        // Comprobar si estamos editando un usuario
        if (userForm.dataset.editing) {
          // Recuperamos el email que estamos editando y el índice del elemento de la lista
          const oldEmail = userForm.dataset.editing;
          const editingIndex = parseInt(userForm.dataset.editingIndex);

          // Reemplaza el elemento existente en el índice con el nuevo elemento
          userList.replaceChild(listItem, userList.children[editingIndex]);
          usersData[oldEmail] = { name, address, email}; // Elimina la versión antigua del usuario del objeto usersData
          userForm.removeAttribute("data-editing"); // Quita la marca de edición
          
        }
        else {
          // Almacena el nuevo usuario en el objeto usersData y luego en localStorage
          usersData[email] = { name, address, email };
          addUserToList(name, address, email);
        }
        localStorage.setItem("usersData", JSON.stringify(usersData));
        userForm.reset(); // Limpia el formulario
        userForm.querySelector("button[type='submit']").textContent = "Agregar Usuario"; // Restaura el texto del botón
      }
      else {
        alert('El email especificado ya existe en la lista')
      }
    }
    else {
      alert('Alguno de los campos no es correcto');
    }
  });

  // Manejar clics en botones de borrar y editar
  userList.addEventListener("click", function (event) {
    deleteUser(event);
    editUser(event);
  });

  // Cargar usuarios almacenados en localStorage al cargar la página
  for (const email in usersData) {
    const userData = usersData[email];
    addUserToList(userData.name, userData.address, userData.email);
  }
});
