<template>
    <div>
        <a href="#" class="card-container">
            <div class="card">
                <img :src="product.image" alt="productImage">
                <div class="card-content">
                    <h3>Product {{ product.id }}</h3>
                    <p>{{ product.title }}</p>
                    <div class="card-bottom">
                        <p><i class="fa-solid fa-star"></i> {{ product.rating }}</p>
                        <p><i class="fa-solid fa-comment"></i> {{ product.numReviews }}</p>
                    </div>
                </div>
            </div>
        </a>
    </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

    .card-container {
        height: 400px;
        width: 200px;
        text-decoration: none;

        .card {
            border-radius: 8px;
            border: 1px solid black;
            display: flex;
            align-content: center;
            justify-content: center;
            flex-direction: column;
            background-color: #f2f2f2;

            img {
                height: 200px;
                width: 150px;
                align-self: center;
                padding-top: 8px;
            }

            &:hover {
                /* Adiciona uma sombra ao card quando o mouse passa sobre ele */
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Você pode ajustar os valores conforme necessário */
            }

            .card-content {
                display: flex;
                flex-direction: column;
                height: 100%; /* Ocupa toda a altura do card */
                padding-top: 8px;
                padding-right: 8px;
                padding-left: 8px;

                h3 {
                    font-size: 24px;
                    align-self: center;
                    color: #232f3e;
                }

                p {
                    flex-grow: 1;
                    height: 50px;
                    overflow: hidden;
                    text-align: center;
                    color: #000000;
                }

                .card-bottom {
                    display: flex;
                    flex-wrap: wrap;

                    i {
                        

                        &.fa-star {
                            color: rgb(255,153,0);
                        }

                        &.fa-comment {
                            color: rgb(20,110,180);
                        }
                    }
                }
            }
        }
    }

</style>