function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "front.html"
      }).catch((error) => {
        console.error(error)
      });
}
