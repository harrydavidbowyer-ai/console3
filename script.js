console.log("JS IS RUNNING");

const btn = document.getElementById("console-toggle");
console.log("console-toggle =", btn);

if (btn) {
    btn.addEventListener("click", () => {
        alert("Console button wired.");
    });
