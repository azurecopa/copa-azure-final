import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Crown, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { worldCups } from '@/data/world-cups';

const DECADES = ['Todas', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

const WorldCupHistory: React.FC = () => {
  const [decadeFilter, setDecadeFilter] = useState<string>('Todas');

  const filteredCups = useMemo(() => {
    if (decadeFilter === 'Todas') return worldCups;
    const decade = parseInt(decadeFilter);
    return worldCups.filter((c) => c.year >= decade && c.year < decade + 10);
  }, [decadeFilter]);

  // Estatísticas globais
  const realizadas = worldCups.filter((c) => !c.upcoming).length;
  const champions = worldCups
    .filter((c) => !c.upcoming)
    .reduce((acc, c) => {
      acc[c.podium.champion] = (acc[c.podium.champion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  const topChampions = Object.entries(champions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">História das Copas do Mundo FIFA</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl mb-3">
            <span className="gold-text">22 Copas</span>, infinitas histórias
          </h1>
          <p className="text-muted-foreground text-lg">
            De 1930 ao Catar 2022 (e a próxima em 2026), conheça em detalhes cada
            uma das edições do maior torneio de futebol do planeta — campeões,
            artilheiros, jogos memoráveis e os momentos que mudaram o esporte.
          </p>
        </div>

        {/* Stats globais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
          <div className="text-center p-4 rounded-xl glass-card">
            <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="font-display text-3xl">{realizadas}</div>
            <div className="text-xs text-muted-foreground">Edições realizadas</div>
          </div>
          <div className="text-center p-4 rounded-xl glass-card">
            <Crown className="w-6 h-6 text-gold mx-auto mb-2" />
            <div className="font-display text-3xl">{Object.keys(champions).length}</div>
            <div className="text-xs text-muted-foreground">Países campeões</div>
          </div>
          <div className="text-center p-4 rounded-xl glass-card">
            <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="font-display text-3xl">96</div>
            <div className="text-xs text-muted-foreground">Anos de história (1930-2026)</div>
          </div>
          <div className="text-center p-4 rounded-xl glass-card">
            <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="font-display text-3xl">2026</div>
            <div className="text-xs text-muted-foreground">Próxima edição</div>
          </div>
        </div>

        {/* Top campeões */}
        <div className="mb-8 p-5 rounded-xl bg-gradient-to-r from-gold/10 to-primary/10 border border-gold/20 max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Maiores campeões mundiais
          </div>
          <div className="flex flex-wrap gap-3">
            {topChampions.map(([nation, titles], i) => (
              <div key={nation} className="flex items-center gap-2">
                <span className="text-2xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                <span className="font-display text-lg">{nation}</span>
                <span className="text-sm text-muted-foreground">
                  ({titles} título{titles > 1 ? 's' : ''})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filtro por década */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {DECADES.map((d) => (
            <Button
              key={d}
              variant={decadeFilter === d ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDecadeFilter(d)}
              className={decadeFilter === d ? 'gold-gradient' : ''}
            >
              {d}
            </Button>
          ))}
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCups.map((cup) => {
            const flagUrl = `https://flagcdn.com/w160/${cup.host.iso}.png`;
            return (
              <Link
                key={cup.year}
                to={`/historia/${cup.year}`}
                className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Bandeira como background */}
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary/40">
                  <img
                    src={flagUrl}
                    alt={cup.host.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

                  {/* Ano em destaque */}
                  <div className="absolute top-4 left-4">
                    <div className="font-display text-4xl md:text-5xl text-white drop-shadow-lg">
                      {cup.year}
                    </div>
                  </div>

                  {/* Upcoming badge */}
                  {cup.upcoming && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gold text-primary-foreground">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Próxima
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Sediada em
                  </div>
                  <h3 className="font-display text-xl mb-3 group-hover:text-primary transition-colors">
                    {cup.host.name}
                  </h3>

                  {!cup.upcoming ? (
                    <div className="flex items-center gap-2 mb-3">
                      <Crown className="w-4 h-4 text-gold flex-shrink-0" />
                      <span className="text-sm">
                        Campeão:{' '}
                        <span className="font-medium text-foreground">
                          {cup.podium.champion}
                        </span>
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-3 text-primary">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Junho-Julho 2026
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {cup.teams} seleções · {cup.matches} jogos
                    </span>
                    <span className="flex items-center gap-1 text-primary font-medium">
                      Ver
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorldCupHistory;
