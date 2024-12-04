<template>
	<div class="home-container">
		<h1 class="title" > ONGs em Parnaíba</h1>
		<div class="search-bar">
			<input type="text" v-model="searchQuery" placeholder="Pesquisar ONG por nome..." />
		</div>
		<div class="grid-container">
			<div class="ong-card" v-for="ong in filteredOngs" :key="ong.id">
				<img :src="ong.imagem" alt="Foto da ONG" class="ong-image" />
				<h2 class="ong-name">{{ ong.nome }}</h2>
				<p class="ong-description">{{ ong.descricao }}</p>

                <div class="content"></div>

                <div class="button-container">
				    <a :href="ong.website" target="_blank" class="website-link">Site</a>
				    <a @click="openDetails(ong)" class="website-link">Informações</a>
                </div>

				<div v-if="selectedOng?.id === ong.id" class="popup-overlay">
					<div class="popup">
						<h2>{{ ong.nome }}</h2>
						<p><strong>Endereço:</strong> {{ ong.endereco }}</p>
						<p><strong>Telefone:</strong> {{ ong.telefone }}</p>
						<p><strong>CEP:</strong> {{ ong.cep }}</p>
						<p><strong>Email:</strong> {{ ong.email }}</p>
						<p><strong>CNPJ:</strong> {{ ong.cnpj }}</p>
						<button @click="closePopup" class="close-button">Fechar</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const ongs = ref([]);
const filteredOngs = ref([]);
const searchQuery = ref("");

const selectedOng = ref(null);


const getCompleteAddress = async (cep, endereco) => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      console.error("Erro ao buscar o endereço", data);
      return endereco;
    }
    
    return `${data.logradouro}, ${endereco}`;
  } catch (error) {
    console.error("Erro na requisição do ViaCEP:", error);
    return endereco;
  }
};

const imageCache = {};

const fetchOngs = async () => {
  const { data, error } = await supabase
    .from('informacoes_ongs')
    .select("id, nome, descricao, website, imagem, endereco, telefone, cep, email, cnpj");

  if (error) {
    console.error('Erro ao buscar ONGs:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.warn('Nenhum dado encontrado.');
    return;
  }

  for (const ong of data) {
    if (!imageCache[ong.imagem]) {
      imageCache[ong.imagem] = ong.imagem;
    }
    ong.endereco = await getCompleteAddress(ong.cep, ong.endereco);
  }

  ongs.value = data;
  filteredOngs.value = data;
};


const openDetails = (ong) => {
	selectedOng.value = ong;
};

const closePopup = () => {
	selectedOng.value = null;
};

const filterOngs = () => {
	const query = searchQuery.value.toLowerCase();
	filteredOngs.value = ongs.value.filter((ong) =>
		ong.nome.toLowerCase().includes(query)
	);
};

watch(searchQuery, filterOngs);

onMounted(fetchOngs);
</script>

<style scoped>
    

.home-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
	font-family: Arial, sans-serif;
}

.title {
	text-align: center;
	margin-bottom: 20px;
	font-size: 2.5em;
	color: #ffffff;
}

.search-bar {
	margin-bottom: 20px;
	text-align: center;
}

.search-bar input {
	width: 100%;
	max-width: 500px;
	padding: 10px;
	font-size: 16px;
	border: 1px solid #ddd;
	border-radius: 5px;
}

.grid-container {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	gap: 20px;
}

.ong-card {
	background: #fff;
	border: 1px solid #ddd;
	border-radius: 10px;
	padding: 5px;
	text-align: center;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	transition: transform 0.3s, box-shadow 0.3s;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
	margin-bottom: 5px;
}

.ong-card .content {
    flex-grow: 1;
}

.ong-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.ong-image {
	width: 100%;
	height: 150px;
	object-fit: cover;
	border-radius: 8px;
	margin-bottom: 10px;
}

.ong-name {
	font-size: 1.2em;
	color: #007BFF;
	margin-bottom: 10px;
}

.ong-description {
	font-size: 0.9em;
	color: #555;
	margin-bottom: 15px;
}

.website-link {
	color: #007BFF;
	text-decoration: none;
	font-size: 1em;
	font-weight: bold;
}

.button-container {
    display: flex;
    gap: 10px;
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
}

.website-link:hover {
	text-decoration: underline;
}

.popup-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.7);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	border-radius: 8px;
}

.popup {
	background: #fff;
	padding: 20px;
	border-radius: 10px;
	width: 90%;
	max-width: 300px;
	text-align: center;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.popup h2 {
	margin-bottom: 15px;
	color: #333;
}

.popup p {
	margin: 10px 0;
	font-size: 1em;
	color: #555;
}

.close-button {
	background: #007bff;
	color: #fff;
	border: none;
	padding: 10px 20px;
	border-radius: 5px;
	cursor: pointer;
	font-size: 1em;
}

.close-button:hover {
	background: #0056b3;
}
</style>
