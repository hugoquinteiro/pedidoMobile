CREATE TABLE empresa (
  codemp INTEGER,
  nomeemp CHARACTER VARYING (50),
  CONSTRAINT pk_codemp PRIMARY KEY (codemp)
);
--SELECT codemp, razaoabrev as nomeemp FROM tsiemp WHERE codemp IN (2,12,13)
/*
Insert into EMPRESA (CODEMP,NOMEEMP) values ('2','MCR - SC');
Insert into EMPRESA (CODEMP,NOMEEMP) values ('12','VLS - SP');
Insert into EMPRESA (CODEMP,NOMEEMP) values ('13','VLS - RJ');
*/

DROP TABLE usuario;
CREATE TABLE usuario (
  id INTEGER,
  login CHARACTER VARYING(20), 
  apelido CHARACTER VARYING(20), 
  codvend INTEGER,
  senha CHARACTER VARYING(20),
  CONSTRAINT pk_id PRIMARY KEY (id)
);
-- SELECT rownum as id, AD_LOGINMOBILE as login,  apelido, codvend, '123' as senha FROM tgfven WHERE AD_ENVIAMOBILE='S';

DROP TABLE CLIENTE;
CREATE TABLE cliente (
codparc INTEGER,
nomeparc CHARACTER VARYING(100),
razaosocial CHARACTER VARYING(100),
cgc_cpf CHARACTER VARYING(14),
codvend INTEGER,
codtab INTEGER,
TIPNEG INTEGER,
CODEMP INTEGER,
IE	CHARACTER VARYING(14),
CEP CHARACTER VARYING(10),		
TIPOENDER CHARACTER VARYING(10),		
ENDERECO CHARACTER VARYING(100),		
NUMERO INTEGER,		
COMPLEMENTO CHARACTER VARYING(30),
CONSTRAINT pk_codparc PRIMARY KEY (codparc)
);
--SELECT codparc, nomeparc, razaosocial, cgc_cpf, codtab, CODVEND, COALESCE((SELECT sugtipnegsaid FROM TGFCPL WHERE codparc=tgfpar.codparc),1) as tipneg FROM tgfpar WHERE codvend IN (SELECT codvend FROM tgfven WHERE AD_ENVMOBILE='S')
--insert into cliente VALUES (999,'CLIENTE TESTE', 'RAZAO TESTE', '01234567891', 7,99,1,2)

drop table tabela;
CREATE TABLE tabela (
  nutab INTEGER,
  codtab INTEGER,
  dtvigor date,
  codtaborig INTEGER,
  percentual DECIMAL(12,2)
  CONSTRAINT pk_nutab PRIMARY KEY (nutab)
);
--INSERT INTO TABELA VALUES (99,99,'2022-04-01', 99)

/*
SELECT nutab, codtab, dtvigor, codtaborig FROM tgftab tab WHERE codtab IN (
SELECT DISTINCT codtab FROM tgfpar WHERE codvend IN (SELECT codvend FROM tgfven WHERE AD_ENVMOBILE='S')
) AND dtvigor=(SELECT MAX(dtvigor) FROM tgftab WHERE codtab=tab.codtab)
*/


DROP TABLE produto;
CREATE TABLE produto (
codprod INTEGER NOT NULL,
descrprod CHARACTER VARYING(150),
marca CHARACTER VARYING(30),
referencia CHARACTER VARYING(30),
codbarra CHARACTER VARYING(13),
CONSTRAINT pk_produto PRIMARY KEY (codprod));
--INSERT INTO PRODUTO  VALUES (1,'PRODUTO TESTE', 'MARCA 01', '0.1.2.3.4.5','789000123456' )

/* 
SELECT CODPROD, DESCRPROD, REFERENCIA, (SELECT CODBARRA FROM TGFBAR WHERE CODPROD=TGFPRO.CODPROD) AS CODBARRA, MARCA 
FROM TGFPRO WHERE CODPROD IN (
    SELECT distinct codprod FROM tgfexc WHERE nutab IN (
    (SELECT nutab FROM TGFTAB TAB WHERE codtab IN (SELECT DISTINCT codtab FROM tgfpar WHERE codvend IN (SELECT codvend FROM tgfven WHERE AD_ENVMOBILE='S')) AND dtvigor=(SELECT MAX(dtvigor) FROM tgftab WHERE codtab=tab.codtab))
    )
) AND ATIVO='S' AND AD_ION_ENVIA='S'
*/

DROP TABLE ITTABELA;
CREATE TABLE ITTABELA (
  NUTAB INTEGER,
  CODPROD INTEGER,
  VLRVENDA DECIMAL(12,2),
  CONSTRAINT fk_ittabela_tabela FOREIGN KEY (nutab)
    REFERENCES tabela (nutab) MATCH SIMPLE ON UPDATE CASCADE ON DELETE NO ACTION,
  CONSTRAINT fk_ittabela_produto FOREIGN KEY (codprod)
    REFERENCES produto (codprod) MATCH SIMPLE ON UPDATE CASCADE ON DELETE NO ACTION
);
--INSERT INTO ITTABELA VALUES (99,1,88.59)
/*
SELECT nutab, codprod, replace(vlrvenda,',','.') as vlrvenda FROM tgfexc
WHERE nutab IN (
    SELECT nutab  FROM tgftab tab WHERE codtab IN (
    SELECT DISTINCT codtab FROM tgfpar WHERE codvend IN (SELECT codvend FROM tgfven WHERE AD_ENVMOBILE='S')
    ) AND dtvigor=(SELECT MAX(dtvigor) FROM tgftab WHERE codtab=tab.codtab)
) 
AND codprod IN ( SELECT codprod FROM tgfpro WHERE  ATIVO='S' AND AD_ION_ENVIA='S')
*/

DROP TABLE ESTOQUE;
CREATE TABLE ESTOQUE (
  CODEMP INTEGER,
  CODPROD INTEGER,
  RESERVADO DECIMAL(12,2),
  ESTOQUE DECIMAL(12,2),
  CONSTRAINT fk_empresa_estoque FOREIGN KEY (codemp)
    REFERENCES empresa (codemp) MATCH SIMPLE ON UPDATE CASCADE ON DELETE NO ACTION,
  CONSTRAINT fk_produto_estoque FOREIGN KEY (codprod)
    REFERENCES produto (codprod) MATCH SIMPLE ON UPDATE CASCADE ON DELETE NO ACTION
);

/*
SELECT CODEMP, CODPROD, RESERVADO, ESTOQUE FROM TGFEST 
WHERE TIPO='P' AND CODLOCAL=2 AND CODEMP IN (2,12,13)
AND codprod IN ( SELECT DISTINCT codprod FROM tgfexc
                WHERE nutab IN (
                    SELECT nutab  FROM tgftab tab WHERE codtab IN (
                    SELECT DISTINCT codtab FROM tgfpar WHERE codvend IN (SELECT codvend FROM tgfven WHERE AD_ENVIAMOBILE='S')
                    ) AND dtvigor=(SELECT MAX(dtvigor) FROM tgftab WHERE codtab=tab.codtab)
                ) 
                AND codprod IN ( SELECT codprod FROM tgfpro WHERE  ATIVO='S' AND AD_ION_ENVIA='S')
)
*/
--INSERT INTO ESTOQUE VALUES (2,1,0,100)

------------------- TABELAS DE PEDIDOS ----------------
DROP TABLE pedido;
CREATE TABLE pedido (
  id SERIAL,
  idlogin INTEGER,
  dtcria TIMESTAMP,
  codvend INTEGER,
  codparc INTEGER,
  nunota INTEGER,
  numnota CHARACTER VARYING(30),
  codemp INTEGER,
  total DECIMAL(12,2),
  vlrdesc DECIMAL(12,2),
  statusped CHARACTER VARYING(3),
  CONSTRAINT pk_pedido PRIMARY KEY (id),
  CONSTRAINT fk_usario_pedido FOREIGN KEY (idlogin)
    REFERENCES usuario (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE NO ACTION,
  CONSTRAINT fk_cliente_pedido FOREIGN KEY (codparc)
    REFERENCES cliente (codparc) MATCH SIMPLE ON UPDATE CASCADE ON DELETE NO ACTION
);
--INSERT INTO pedido (usuario, dtcria, total) VALUES ('Outros', CURRENT_TIMESTAMP, 100.99);


DROP TABLE itpedido;
CREATE TABLE itpedido (
  id INTEGER NOT NULL,
  codprod INTEGER NOT NULL,
  quantidade INTEGER,
  vlrvenda DECIMAL,
  CONSTRAINT fk_itpedido_pedido FOREIGN KEY (id)
	  REFERENCES pedido (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE
);
-- INSERT INTO itpedido VALUES (1, 147, 2, 50.5);
CREATE OR REPLACE FUNCTION atualiza_total()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
	UPDATE PEDIDO SET total=(SELECT SUM(quantidade*vlrvenda) FROM itpedido WHERE id=new.id) WHERE id=new.id;
	RETURN NEW;
END;
$$;


CREATE TRIGGER TRG_ATUALIZA_TOTPED
AFTER INSERT OR UPDATE OR DELETE ON itpedido
FOR EACH ROW
    EXECUTE FUNCTION atualiza_total();



------------------- TABELA DE CONTROLE DE STATUS ----------------
CREATE TABLE tabelastatus (
  tabela CHARACTER VARYING(30),
  campo  CHARACTER VARYING(30),
  status CHARACTER VARYING(30),
  descricao CHARACTER VARYING(30),
  CONSTRAINT pk_tabelastatus PRIMARY KEY (tabela, campo, status)
);
/*
INSERT INTO tabelastatus VALUES ('PEDIDO', 'STATUSPED', 'PED', 'PEDENTE');
INSERT INTO tabelastatus VALUES ('PEDIDO', 'STATUSPED', 'INT', 'INTEGRADO AO ERP');
INSERT INTO tabelastatus VALUES ('PEDIDO', 'STATUSPED', 'FAT', 'FATURADO');
INSERT INTO tabelastatus VALUES ('PEDIDO', 'STATUSPED', 'ERR', 'ERRO NO ENVIO');
INSERT INTO tabelastatus VALUES ('PEDIDO', 'STATUSPED', 'SAL', 'SALVO - ENVIO FUTURO');
*/

CREATE OR REPLACE FUNCTION STATUSDESCR (V_TABELA TEXT, V_CAMPO TEXT, V_STATUS TEXT)
RETURNS TEXT 
  LANGUAGE PLPGSQL
  AS
$$
DECLARE V_DESCR TEXT;
BEGIN
	SELECT DESCRICAO INTO V_DESCR FROM TABELASTATUS WHERE TABELA=V_TABELA AND CAMPO=V_CAMPO AND STATUS=V_STATUS; 
	RETURN V_DESCR;
END;
$$;


--Teste  Hugo para atualizar

