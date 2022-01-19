DROP TABLE usuario;
CREATE TABLE usuario (
  id INTEGER,
  login CHARACTER VARYING(20), 
  apelido CHARACTER VARYING(20), 
  codvend INTEGER,
  senha CHARACTER VARYING(20),
  CONSTRAINT pk_id PRIMARY KEY (id)
);
-- SELECT rownum as id, apelido as login,  apelido, codvend, '123' as senha FROM tgfven WHERE AD_ENVMOBILE='S';

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
CONSTRAINT pk_codparc PRIMARY KEY (codparc)
);
--SELECT codparc, nomeparc, razaosocial, cgc_cpf, codtab, CODVEND, COALESCE((SELECT sugtipnegsaid FROM TGFCPL WHERE codparc=tgfpar.codparc),1) as tipneg FROM tgfpar WHERE codvend IN (SELECT codvend FROM tgfven WHERE AD_ENVMOBILE='S')

drop table tabela;
CREATE TABLE tabela (
  nutab INTEGER,
  codtab INTEGER,
  dtvigor date,
  codtaborig INTEGER,
  CONSTRAINT pk_nutab PRIMARY KEY (nutab)
);

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




/*
--DROP TABLE pedido
CREATE TABLE pedido (
  id SERIAL,
  usuario CHARACTER VARYING(30),
  dtcria TIMESTAMP,
  total DECIMAL(12,2),
  vlrdesc DECIMAL(12,2),
  CONSTRAINT pk_pedido PRIMARY KEY (id)
);
--INSERT INTO pedido (usuario, dtcria, total) VALUES ('Outros', CURRENT_TIMESTAMP, 100.99);


--DROP TABLE itpedido
CREATE TABLE itpedido (
  id INTEGER NOT NULL,
  codprod INTEGER NOT NULL,
  quantidade INTEGER,
  vlrvenda DECIMAL,
  codbarra CHARACTER VARYING(13),
  CONSTRAINT fk_itpedido_pedido FOREIGN KEY (id)
    REFERENCES pedido (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE NO ACTION 
);
-- INSERT INTO itpedido VALUES (1, 147, 2, 50.5);
*/