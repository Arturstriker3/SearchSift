<template>
  <div>
    <header>
      <div class="search">
        <form class="search-form" @submit.prevent="searchProducts">
          <input type="text" v-model="searchKeyword" placeholder="Search for products on Amazon...">
          <input type="submit" value="Search">
        </form>
      </div>
    </header>

    <main>
      <div v-if="loading" class="loader-container">
        <loader/>
      </div>
      <div v-else>
        <div v-if="products.length > 0" class="cards">
          <Cards v-for="product in products" :key="product.id" :product="product"/>
        </div>
        <div v-else>
          <a href="http://localhost:3000/api/doc/#/" target="_blank">Api Swagger</a>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import Cards from '../components/productCard.vue';
import Loader from '../components/loaderSpinner.vue';

export default {
  components: {
    Cards,
    Loader
  },
  data() {
    return {
      searchKeyword: '',
      products: [],
      loading: false
    };
  },
  methods: {
    async searchProducts() {
      try {
        this.loading = true;

        const response = await axios.get(`http://localhost:3000/api/scrape?keyword=${this.searchKeyword}`);
        this.products = response.data;
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        this.loading = false; // end loading...
      }
    }
  }
}
</script>

<style lang="scss" scoped>

// Header Inputbar

header {

  margin-bottom: 16px;

  .search{
    border: 2px solid #146eb4;
    overflow: auto;
    border-radius: 5px;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
  }

  .search input[type="text"]{
    border: 0px;
    width: 67%;
    padding: 10px 10px;
  }

  .search input[type="text"]:focus{
    outline: 0;
  }

  .search input[type="submit"]{
    border: 0px;
    background: none;
    background-color: #146eb4;
    color: #f2f2f2;
    float: right;
    padding: 10px;
    -moz-border-radius-top-right: 5px;
    -webkit-border-radius-top-right: 5px;
    -moz-border-radius-bottom-right: 5px;
    -webkit-border-radius-bottom-right: 5px;
    cursor:pointer;
  }

  @media only screen and (min-width : 150px) and (max-width : 780px){
    .search
    {
      width: 95%;
      margin: 0 auto;
    }
  }
}

// Main Cards Component

main {

  .loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow: hidden;
  }

  .cards {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-gap: 1rem;

    a {
      text-decoration: none;
    }
  }

  /* Screen larger than 600px? 2 column */
  @media (min-width: 600px) {
    .cards { grid-template-columns: repeat(2, 1fr); }
  }

  /* Screen larger than 900px? 3 columns */
  @media (min-width: 900px) {
    .cards { grid-template-columns: repeat(3, 1fr); }
  } 
}

</style>