<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRespostasAvaliacaoAlunosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('answers', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('resposta');

            $table->integer('fk_avaliacao_questao_id')->unsigned();
            $table->foreign('fk_avaliacao_questao_id')->references('id')->on('avaliacao_questao')->onDelete('cascade');


            $table->integer('fk_aplicacao_avaliacao_id')->unsigned();
            $table->foreign('fk_aplicacao_avaliacao_id')->references('id')->on('aplicacao_avaliacao')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('respostas');
    }
}
