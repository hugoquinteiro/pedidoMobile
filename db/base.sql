--DROP TABLE produto 
CREATE TABLE produto (
codprod INTEGER NOT NULL,
descrprod CHARACTER VARYING(150),
marca CHARACTER VARYING(30),
referencia CHARACTER VARYING(30),
codbarra CHARACTER VARYING(13),
vlrvenda DECIMAL(12,2),
CONSTRAINT pk_produto PRIMARY KEY (codprod))

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

--DROP TABLE usuario
CREATE TABLE usuario (
  id INTEGER,
  login CHARACTER VARYING(20), 
  apelido CHARACTER VARYING(20), 
  codvend INTEGER
);
-- SELECT rownum as id, apelido as login,  apelido, codvend FROM tgfven WHERE AD_ENVMOBILE='S';


CREATE TABLE cliente (
codparc INTEGER,
nomeparc CHARACTER VARYING(100),
razaosocial CHARACTER VARYING(100),
cgc_cpf CHARACTER VARYING(14),
codvend INTEGER,
codtab INTEGER,
TIPNEG INTEGER
);
--SELECT codparc, nomeparc, razaosocial, cgc_cpf, codtab, CODVEND, (SELECT sugtipnegsaid FROM TGFCPL WHERE codparc=9999) as tipneg FROM tgfpar WHERE codvend IN (SELECT codvend FROM tgfven WHERE AD_ENVMOBILE='S')


CREATE TABLE tabela (
  nutab INTEGER,
  codtab INTEGER,
  dtvigor date,
  codtaborig INTEGER
)

/*
SELECT nutab, codtab, dtvigor, codtaborig FROM tgftab tab WHERE codtab IN (
SELECT DISTINCT codtab FROM tgfpar WHERE codvend IN (SELECT codvend FROM tgfven WHERE AD_ENVMOBILE='S')
) AND dtvigor=(SELECT MAX(dtvigor) FROM tgftab WHERE codtab=tab.codtab)
*/


/*  SQL de busca no Sankhya
SELECT 
    exc.CODPROD
    ,pro.DESCRPROD
    ,bar.CODBARRA
    ,pro.REFERENCIA
    ,REPLACE(TO_CHAR(COALESCE(ROUND(exc.VLRVENDA,2),50.01)),',','.') as vlrvenda --temporario trocando nulo por 50.01
    ,pro.MARCA
FROM tgfexc exc
INNER JOIN tgfpro pro ON (exc.codprod = pro.codprod)
LEFT JOIN tgfbar bar ON (pro.codprod  = bar.codprod)
WHERE pro.marca NOT IN ('MQ TESOURA')
AND exc.nutab=440
*/