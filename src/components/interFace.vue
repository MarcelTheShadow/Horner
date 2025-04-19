<script setup>
import { ref } from 'vue';
const funktionString = ref('');
const funktionStringRefreshed = ref('');
const isValid = ref(false);

//Function to check if the input is a valid polynomial function when button is clicked
const functionValidOrNot = () => {
    funktionStringRefreshed.value = funktionString.value;
    if (checkRegEx(funktionStringRefreshed.value)) {
        isValid.value = true;
    } else {
        isValid.value = false;
    }
};

const checkRegEx = (input) => {
    // Regular expression to check if the input is a valid polynomial function
    const regex = /^\s*[+-]?\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?(\s*[+-]\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?\s*)*$/; 
    return regex.test(input);
}
</script>

<template>
    <div class="view">
        <input type="text" v-model="funktionString" placeholder="Gib hier deine Zahl ein"/>
        <button @click="functionValidOrNot">Berechne</button>
    </div>
    <div class="anzeige">
        <p>Die Zahl ist: {{ funktionStringRefreshed }}</p>
        <p v-if="isValid">Die Funktion ist gültig</p>
        <p v-else>Die Funktion ist ungültig</p>
    </div>
</template>

<style scoped>
    .view {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 60%;
        
    }
    
    .anzeige{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 40%;
    }

    input {
        height: 40px;
        width: 400px;
        margin-bottom: 20px;
    }
    
    button {
        height: 40px;
        width: 200px;
    }
</style>