<template>
    <div>
        <span class="loader"></span>
    </div>
</template>

<style lang="scss">

.loader {
    width: 80px;
    height: 80px;
    border: 5px solid #146eb4;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
} 

</style>